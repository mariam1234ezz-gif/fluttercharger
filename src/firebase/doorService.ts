import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  DoorEvent,
  Penalty,
  Station,
  PENALTY_THRESHOLD_SECONDS,
  PENALTY_AMOUNT,
  PENALTY_REASON
} from '@/types/door.types'
import {
  createAlert,
  ALERT_TYPES,
  ALERT_SEVERITY
} from '@/services/alertService'

// Collection references
const doorEventsCollection = collection(db, 'doorEvents')
const penaltiesCollection = collection(db, 'penalties')
const stationsCollection = collection(db, 'stations')

// ============================================
// Core Functions
// ============================================

/**
 * Handle door open event
 * Called when magnetic sensor detects door opened
 */
export async function handleDoorOpen(
  userId: string,
  stationId: string
): Promise<string> {
  // 1. Check station exists and maintenance mode
  const stationDoc = await getDoc(doc(stationsCollection, stationId))
  
  if (!stationDoc.exists()) {
    throw new Error(`Station ${stationId} not found`)
  }
  
  const stationData = stationDoc.data() as Partial<Station>
  
  // 2. Check maintenance mode
  if (stationData.maintenanceMode) {
    throw new Error('Station is in maintenance mode')
  }
  
  // 3. Check user is authenticated
  if (!userId) {
    throw new Error('User not authenticated')
  }
  
  // 4. Create new door event
  const doorEventData = {
    userId,
    stationId,
    openedAt: serverTimestamp(),
    closedAt: null,
    durationSeconds: null,
    status: 'open',
    penaltyApplied: false
  }
  
  const docRef = await addDoc(doorEventsCollection, doorEventData)
  
  // 5. Update station with current door state
  await updateDoc(doc(stationsCollection, stationId), {
    currentDoorState: 'OPEN',
    lastOpenedBy: userId,
    lastOpenedAt: serverTimestamp()
  })
  
  return docRef.id
}

/**
 * Handle door close event
 * Called when magnetic sensor detects door closed
 */
export async function handleDoorClose(
  eventId: string,
  stationId: string
): Promise<void> {
  // 1. Fetch the door event doc
  const eventDoc = await getDoc(doc(doorEventsCollection, eventId))
  
  if (!eventDoc.exists()) {
    throw new Error(`Door event ${eventId} not found`)
  }
  
  const eventData = eventDoc.data() as DoorEvent
  const openedAt = eventData.openedAt as unknown as Timestamp
  
  // 2. Calculate duration
  const now = Timestamp.now()
  const durationSeconds = Math.floor(
    (now.seconds - openedAt.seconds)
  )
  
  // 3. Determine status
  const status: DoorEvent['status'] =
    durationSeconds <= PENALTY_THRESHOLD_SECONDS
      ? 'closed_normal'
      : 'violation'
  
  // 4. Update door event
  await updateDoc(doc(doorEventsCollection, eventId), {
    closedAt: serverTimestamp(),
    durationSeconds,
    status
  })
  
  // 5. Update station
  await updateDoc(doc(stationsCollection, stationId), {
    currentDoorState: 'CLOSED',
    lastOpenedBy: null
  })
  
  // 6. Apply penalty if violation
  if (status === 'violation' && !eventData.penaltyApplied) {
    await applyPenalty(eventId)
  }
}

/**
 * Monitor door state and apply penalty after 7 minutes
 * Also creates alerts at 5-minute (warning) and 7-minute (violation) marks
 * Returns cleanup function that cancels both timers
 */
export function monitorDoorState(
  stationId: string,
  eventId: string,
  userId?: string
): () => void {
  const WARNING_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes
  const PENALTY_THRESHOLD_MS = PENALTY_THRESHOLD_SECONDS * 1000 // 7 minutes
  
  // Warning timer - at 5 minutes
  const warningTimer = setTimeout(async () => {
    try {
      console.log('[DoorMonitor] 5-min warning timer fired for eventId:', eventId);
      
      // Re-fetch door event - check status is still "open"
      const eventDoc = await getDoc(doc(doorEventsCollection, eventId))
      
      if (!eventDoc.exists()) {
        console.log('[DoorMonitor] Event doc not found at 5min');
        return
      }
      
      const eventData = eventDoc.data() as DoorEvent
      console.log('[DoorMonitor] door status at 5min:', eventData.status);
      
      // If still open, create warning alert
      if (eventData.status === 'open') {
        console.log('[DoorMonitor] Calling createAlert for WARNING...');
        const result = await createAlert({
          type: ALERT_TYPES.DOOR_WARNING,
          severity: ALERT_SEVERITY.WARNING,
          stationId,
          userId: userId || eventData.userId,
          message: 'Door has been open for 5 minutes — close soon to avoid penalty',
          relatedEventId: eventId,
        })
        console.log('[DoorMonitor] createAlert result:', result);
      }
    } catch (error) {
      console.error('[DoorMonitor] Error in door warning timer:', error)
    }
  }, WARNING_THRESHOLD_MS)
  
  // Violation timer - at 7 minutes
  const violationTimer = setTimeout(async () => {
    try {
      console.log('[DoorMonitor] 7-min violation timer fired for eventId:', eventId);
      
      // 1. Re-fetch door event - check status is still "open"
      const eventDoc = await getDoc(doc(doorEventsCollection, eventId))
      
      if (!eventDoc.exists()) {
        console.log('[DoorMonitor] Event doc not found at 7min');
        return
      }
      
      const eventData = eventDoc.data() as DoorEvent
      console.log('[DoorMonitor] door status at 7min:', eventData.status);
      console.log('[DoorMonitor] penaltyApplied:', eventData.penaltyApplied);
      
      // 2. If still open, apply penalty
      if (eventData.status === 'open' && !eventData.penaltyApplied) {
        console.log('[DoorMonitor] Calling applyPenalty...');
        await applyPenalty(eventId)
        
        // Update door event status to violation
        await updateDoc(doc(doorEventsCollection, eventId), {
          status: 'violation',
          penaltyApplied: true
        })
        
        // Create violation alert
        console.log('[DoorMonitor] Calling createAlert for VIOLATION...');
        const alertResult = await createAlert({
          type: ALERT_TYPES.DOOR_VIOLATION,
          severity: ALERT_SEVERITY.CRITICAL,
          stationId,
          userId: userId || eventData.userId,
          message: 'Door left open for more than 7 minutes — penalty applied',
          relatedEventId: eventId,
        })
        console.log('[DoorMonitor] createAlert result:', alertResult);
      }
    } catch (error) {
      console.error('[DoorMonitor] Error in door monitoring timer:', error)
    }
  }, PENALTY_THRESHOLD_MS)
  
  // Return cleanup function that cancels BOTH timers
  return () => {
    clearTimeout(warningTimer)
    clearTimeout(violationTimer)
  }
}

/**
 * Apply penalty for door violation
 */
export async function applyPenalty(eventId: string): Promise<void> {
  // 1. Fetch door event
  const eventDoc = await getDoc(doc(doorEventsCollection, eventId))
  
  if (!eventDoc.exists()) {
    throw new Error(`Door event ${eventId} not found`)
  }
  
  const eventData = eventDoc.data() as DoorEvent
  
  // 2. Guard: skip if no userId
  if (!eventData.userId) {
    console.warn('Cannot apply penalty: no userId associated')
    return
  }
  
  // 3. Check station maintenance mode
  const stationDoc = await getDoc(doc(stationsCollection, eventData.stationId))
  
  if (stationDoc.exists()) {
    const stationData = stationDoc.data() as Station
    if (stationData.maintenanceMode) {
      console.warn('Cannot apply penalty: station in maintenance mode')
      return
    }
  }
  
  // 4. Skip if already applied
  if (eventData.penaltyApplied) {
    console.warn('Penalty already applied for event', eventId)
    return
  }
  
  // 5. Create penalty record
  await addDoc(penaltiesCollection, {
    userId: eventData.userId,
    stationId: eventData.stationId,
    amount: PENALTY_AMOUNT,
    reason: PENALTY_REASON,
    timestamp: serverTimestamp(),
    relatedEventId: eventId
  })
  
  // 6. Update door event
  await updateDoc(doc(doorEventsCollection, eventId), {
    penaltyApplied: true,
    status: 'violation'
  })
}

// ============================================
// Query Functions
// ============================================

/**
 * Get station door status
 */
export async function getStationDoorStatus(
  stationId: string
): Promise<Station | null> {
  const stationDoc = await getDoc(doc(stationsCollection, stationId))
  
  if (!stationDoc.exists()) {
    return null
  }
  
  return {
    id: stationDoc.id,
    ...stationDoc.data()
  } as Station
}

/**
 * Get all stations
 */
export async function getAllStations(): Promise<Station[]> {
  const snapshot = await getDocs(stationsCollection)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Station[]
}

/**
 * Get door events for a station
 */
export async function getDoorEventsForStation(
  stationId: string,
  limitCount: number = 20
): Promise<DoorEvent[]> {
  const q = query(
    doorEventsCollection,
    where('stationId', '==', stationId),
    orderBy('openedAt', 'desc'),
    limit(limitCount)
  )
  
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as DoorEvent[]
}

/**
 * Get penalties for a user
 */
export async function getUserPenalties(userId: string): Promise<Penalty[]> {
  const q = query(
    penaltiesCollection,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  )
  
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Penalty[]
}

/**
 * Get total penalty amount for a user
 */
export async function getUserTotalPenalties(userId: string): Promise<number> {
  const penalties = await getUserPenalties(userId)
  
  return penalties.reduce((total, penalty) => total + penalty.amount, 0)
}

/**
 * Check for open events on app load (retroactive penalty)
 */
export async function checkOpenEventsForPenalty(): Promise<void> {
  const q = query(
    doorEventsCollection,
    where('status', '==', 'open'),
    where('penaltyApplied', '==', false)
  )
  
  const snapshot = await getDocs(q)
  const now = Timestamp.now().seconds
  
  for (const docSnapshot of snapshot.docs) {
    const eventData = docSnapshot.data() as DoorEvent
    const openedAt = eventData.openedAt as unknown as Timestamp
    
    if (openedAt) {
      const elapsedSeconds = now - openedAt.seconds
      
      if (elapsedSeconds >= PENALTY_THRESHOLD_SECONDS) {
        // Apply penalty retroactively
        await applyPenalty(docSnapshot.id)
      }
    }
  }
}

// ============================================
// Real-time Listeners
// ============================================

/**
 * Subscribe to station door status changes
 */
export function subscribeToStationDoorStatus(
  stationId: string,
  callback: (station: Station | null) => void
): Unsubscribe {
  return onSnapshot(doc(stationsCollection, stationId), (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      } as Station)
    } else {
      callback(null)
    }
  })
}

/**
 * Subscribe to door events
 */
export function subscribeToDoorEvents(
  limitCount: number,
  callback: (events: DoorEvent[]) => void
): Unsubscribe {
  const q = query(
    doorEventsCollection,
    orderBy('openedAt', 'desc'),
    limit(limitCount)
  )
  
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DoorEvent[]
    
    callback(events)
  })
}

/**
 * Subscribe to user penalties
 */
export function subscribeToUserPenalties(
  userId: string,
  callback: (penalties: Penalty[]) => void
): Unsubscribe {
  const q = query(
    penaltiesCollection,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const penalties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Penalty[]
    
    callback(penalties)
  })
}

/**
 * Subscribe to all stations
 */
export function subscribeToAllStations(
  callback: (stations: Station[]) => void
): Unsubscribe {
  return onSnapshot(stationsCollection, (snapshot) => {
    const stations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Station[]
    
    callback(stations)
  })
}