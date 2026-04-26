import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'

// ============================================
// Alert Type Constants
// ============================================
export const ALERT_TYPES = {
  DOOR_VIOLATION: 'DOOR_VIOLATION',
  DOOR_WARNING: 'DOOR_WARNING',
}

// ============================================
// Alert Severity Constants
// ============================================
export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
}

// ============================================
// createAlert(alertData)
// ============================================
/**
 * Creates a new alert in Firestore with deduplication guard
 * @param {Object} alertData - Alert data object
 * @param {string} alertData.type - Alert type (DOOR_VIOLATION, DOOR_WARNING)
 * @param {string} alertData.severity - Alert severity (critical, warning)
 * @param {string} alertData.stationId - Station ID
 * @param {string} alertData.userId - User ID who triggered the alert
 * @param {string} alertData.message - Alert message
 * @param {string} alertData.relatedEventId - Related door event ID for dedup
 * @returns {Promise<DocumentReference|null>} - New document reference or null if duplicate
 */
export async function createAlert(alertData) {
  console.log('[AlertService] createAlert called with:', alertData);

  const {
    type,
    severity,
    stationId,
    userId,
    message,
    relatedEventId
  } = alertData

  // Validate required fields
  if (!type || !stationId || !relatedEventId) {
    console.warn('[AlertService] Missing required fields', { type, stationId, relatedEventId })
    return null
  }

  // 1. Dedup check - query for existing alert with same relatedEventId and type
  const alertsRef = collection(db, 'alerts')
  const dupQuery = query(
    alertsRef,
    where('relatedEventId', '==', relatedEventId),
    where('type', '==', type)
  )

  const existing = await getDocs(dupQuery)
  console.log('[AlertService] duplicate check count:', existing.size);

  if (!existing.empty) {
    console.warn('[AlertService] DUPLICATE DETECTED — skipping write');
    return null
  }

  // 2. Write new alert
  const newAlert = {
    type,
    severity,
    stationId,
    userId: userId || null,
    message,
    relatedEventId,
    timestamp: serverTimestamp(),
    status: 'active',
  }

  console.log('[AlertService] Writing alert to Firestore:', newAlert);
  const docRef = await addDoc(alertsRef, newAlert)
  console.log('[AlertService] Alert written with ID:', docRef.id);
  
  return docRef
}

// ============================================
// resolveAlert(alertId)
// ============================================
/**
 * Resolves an alert by updating its status to "resolved"
 * @param {string} alertId - The alert document ID
 * @returns {Promise<void>}
 */
export async function resolveAlert(alertId) {
  if (!alertId) {
    console.warn('resolveAlert: Missing alertId')
    return
  }

  const alertDoc = doc(db, 'alerts', alertId)
  
  await updateDoc(alertDoc, {
    status: 'resolved',
    resolvedAt: serverTimestamp(),
  })
  
  console.log('resolveAlert: Alert resolved', alertId)
}

// ============================================
// resolveAlertsByEventId(eventId)
// ============================================
/**
 * Resolves all alerts related to a specific door event
 * @param {string} eventId - The door event ID
 * @returns {Promise<number>} - Number of alerts resolved
 */
export async function resolveAlertsByEventId(eventId) {
  if (!eventId) {
    console.warn('resolveAlertsByEventId: Missing eventId')
    return 0
  }

  const alertsRef = collection(db, 'alerts')
  const eventQuery = query(
    alertsRef,
    where('relatedEventId', '==', eventId)
  )

  const snapshot = await getDocs(eventQuery)
  let resolvedCount = 0

  for (const alertDoc of snapshot.docs) {
    await updateDoc(alertDoc.ref, {
      status: 'resolved',
      resolvedAt: serverTimestamp(),
    })
    resolvedCount++
  }

  console.log('resolveAlertsByEventId: Resolved', resolvedCount, 'alerts for event', eventId)
  return resolvedCount
}

// ============================================
// getAlertsForStation(stationId)
// ============================================
/**
 * Fetches all alerts for a specific station
 * @param {string} stationId - The station ID
 * @returns {Promise<Array>} - Array of alert objects
 */
export async function getAlertsForStation(stationId) {
  if (!stationId) {
    console.warn('getAlertsForStation: Missing stationId')
    return []
  }

  const alertsRef = collection(db, 'alerts')
  const stationQuery = query(
    alertsRef,
    where('stationId', '==', stationId)
  )

  const snapshot = await getDocs(stationQuery)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// ============================================
// getActiveAlertCount()
// ============================================
/**
 * Gets count of active (unresolved) alerts
 * @returns {Promise<number>} - Number of active alerts
 */
export async function getActiveAlertCount() {
  const alertsRef = collection(db, 'alerts')
  const activeQuery = query(
    alertsRef,
    where('status', '==', 'active')
  )

  const snapshot = await getDocs(activeQuery)
  return snapshot.size
}