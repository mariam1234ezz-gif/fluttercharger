import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore'
import { handleSafetyEvent } from '@/services/safetyService'

/**
 * Custom hook for real-time safety monitoring
 * Listens to latest sensor reading and orchestrates safety response
 * @param {string} stationId - Station identifier
 * @returns {Object} {sensorData, safetyStatus, chargingOn, fanState, loading, error}
 */
export function useSafetyMonitor(stationId) {
  const [sensorData, setSensorData] = useState(null)
  const [safetyStatus, setSafetyStatus] = useState('SAFE')
  const [chargingOn, setChargingOn] = useState(true)
  const [fanState, setFanState] = useState('OFF')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!stationId) {
      setLoading(false)
      return
    }

    console.log('[useSafetyMonitor] Setting up listener for station:', stationId)
    setLoading(true)
    setError(null)

    // Query latest sensor reading
    const readingsRef = collection(db, 'stations', stationId, 'sensorReadings')
    const q = query(readingsRef, orderBy('timestamp', 'desc'), limit(1))

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          if (snapshot.empty) {
            console.log('[useSafetyMonitor] No sensor readings yet for station:', stationId)
            setLoading(false)
            return
          }

          const reading = snapshot.docs[0].data()
          console.log('[useSafetyMonitor] New sensor reading:', reading)

          setSensorData(reading)

          // Call safety orchestrator
          const assessment = await handleSafetyEvent(stationId, reading)

          // Update state from assessment
          setSafetyStatus(assessment.safetyStatus)
          setChargingOn(!assessment.shouldStopCharging)
          setFanState(assessment.fanState)
          setLoading(false)
        } catch (err) {
          console.error('[useSafetyMonitor] Error processing sensor reading:', err)
          setError(err)
          setLoading(false)
        }
      },
      (err) => {
        console.error('[useSafetyMonitor] Firestore listener error:', err)
        setError(err)
        setLoading(false)
      }
    )

    // Cleanup subscription
    return () => {
      console.log('[useSafetyMonitor] Unsubscribing from station:', stationId)
      unsubscribe()
    }
  }, [stationId])

  return { sensorData, safetyStatus, chargingOn, fanState, loading, error }
}