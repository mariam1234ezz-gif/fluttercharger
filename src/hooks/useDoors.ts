'use client'

import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { rtdb } from '@/lib/firebase'

export type DoorStatus = 'OPEN' | 'CLOSED'

export interface DoorsState {
  [stationId: string]: DoorStatus
}

/**
 * Hook to fetch all doors real-time status
 * Path: doors/{stationId}
 */
export function useDoorsStatus() {
  const [doors, setDoors] = useState<DoorsState>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const doorsRef = ref(rtdb, 'doors')
      
      const unsubscribe = onValue(
        doorsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setDoors(snapshot.val())
          } else {
            setDoors({})
          }
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('[useDoorsStatus] Error:', err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => off(doorsRef)
    } catch (err: any) {
      console.error('[useDoorsStatus] Setup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  return { doors, loading, error }
}

/**
 * Hook to fetch single door status with live timer
 */
export function useDoorStatus(stationId: string) {
  const [doorStatus, setDoorStatus] = useState<DoorStatus | null>(null)
  const [openDuration, setOpenDuration] = useState(0) // in seconds
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!stationId) {
      setLoading(false)
      return
    }

    try {
      const doorRef = ref(rtdb, `doors/${stationId}`)
      
      const unsubscribe = onValue(
        doorRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const status = snapshot.val()
            setDoorStatus(status)
            
            // Reset timer when door closes
            if (status === 'CLOSED') {
              setOpenDuration(0)
            }
          } else {
            setDoorStatus(null)
          }
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('[useDoorStatus] Error:', err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => off(doorRef)
    } catch (err: any) {
      console.error('[useDoorStatus] Setup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [stationId])

  // Timer to track door open duration
  useEffect(() => {
    if (doorStatus === 'OPEN') {
      const interval = setInterval(() => {
        setOpenDuration((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [doorStatus])

  return { doorStatus, openDuration, loading, error }
}
