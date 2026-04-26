import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where
} from 'firebase/firestore'

/**
 * Custom hook for real-time alerts from Firestore
 * @param {number} maxAlerts - Maximum number of alerts to fetch (default: 50)
 * @param {string} statusFilter - Filter by status: 'active' | 'resolved' | null for all
 * @returns {Object} - { alerts, loading, error }
 */
export function useAlerts(maxAlerts = 50, statusFilter = null) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Build query based on filters
    const alertsRef = collection(db, 'alerts')
    
    let q = query(
      alertsRef,
      orderBy('timestamp', 'desc'),
      limit(maxAlerts)
    )

    // If status filter is provided, add where clause
    if (statusFilter) {
      q = query(
        alertsRef,
        where('status', '==', statusFilter),
        orderBy('timestamp', 'desc'),
        limit(maxAlerts)
      )
    }

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('[useAlerts] snapshot received, count:', snapshot.docs.length);
        const alertsData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to Date for display
            timestamp: data.timestamp?.toDate?.() || data.timestamp,
            resolvedAt: data.resolvedAt?.toDate?.() || data.resolvedAt,
          }
        })
        setAlerts(alertsData)
        setLoading(false)
      },
      (error) => {
        console.error('[useAlerts] Firestore listener error:', error);
        setError(error)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [maxAlerts, statusFilter])

  return { alerts, loading, error }
}

/**
 * Hook for active alerts only
 */
export function useActiveAlerts(maxAlerts = 50) {
  return useAlerts(maxAlerts, 'active')
}

/**
 * Hook for resolved alerts only
 */
export function useResolvedAlerts(maxAlerts = 50) {
  return useAlerts(maxAlerts, 'resolved')
}

/**
 * Hook for alerts filtered by station
 */
export function useStationAlerts(stationId, maxAlerts = 50) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!stationId) {
      setLoading(false)
      return
    }

    const alertsRef = collection(db, 'alerts')
    const q = query(
      alertsRef,
      where('stationId', '==', stationId),
      orderBy('timestamp', 'desc'),
      limit(maxAlerts)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alertsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp,
        }))
        setAlerts(alertsData)
        setLoading(false)
      },
      (err) => {
        console.error('useStationAlerts: Error:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [stationId, maxAlerts])

  return { alerts, loading, error }
}

/**
 * Hook for door-related alerts only
 */
export function useDoorAlerts(maxAlerts = 50) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const alertsRef = collection(db, 'alerts')
    const q = query(
      alertsRef,
      orderBy('timestamp', 'desc'),
      limit(maxAlerts)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Filter to only door-related alerts
        const doorAlerts = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp,
          }))
          .filter((alert) => 
            alert.type?.startsWith('DOOR_')
          )
        setAlerts(doorAlerts)
        setLoading(false)
      },
      (err) => {
        console.error('useDoorAlerts: Error:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [maxAlerts])

  return { alerts, loading, error }
}