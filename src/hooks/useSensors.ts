'use client'

import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { rtdb } from '@/lib/firebase'

export interface SensorData {
  voltage: number
  current: number
  soc: number
  temperature: number
  timestamp?: number
}

export interface SensorsState {
  [stationId: string]: SensorData
}

/**
 * Hook to fetch real-time sensors data from Firebase
 * Path: sensors/{stationId}
 */
export function useSensorsData() {
  const [sensors, setSensors] = useState<SensorsState>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const sensorsRef = ref(rtdb, 'sensors')
      
      const unsubscribe = onValue(
        sensorsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setSensors(snapshot.val())
          } else {
            setSensors({})
          }
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('[useSensorsData] Error:', err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => off(sensorsRef)
    } catch (err: any) {
      console.error('[useSensorsData] Setup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  return { sensors, loading, error }
}

/**
 * Hook to fetch single station sensor data
 */
export function useSensorData(stationId: string) {
  const [sensor, setSensor] = useState<SensorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!stationId) {
      setLoading(false)
      return
    }

    try {
      const sensorRef = ref(rtdb, `sensors/${stationId}`)
      
      const unsubscribe = onValue(
        sensorRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setSensor(snapshot.val())
          } else {
            setSensor(null)
          }
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('[useSensorData] Error:', err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => off(sensorRef)
    } catch (err: any) {
      console.error('[useSensorData] Setup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [stationId])

  return { sensor, loading, error }
}
