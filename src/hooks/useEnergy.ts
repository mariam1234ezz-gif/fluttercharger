'use client'

import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { rtdb } from '@/lib/firebase'

export interface EnergyData {
  solar: number
  grid: number
  total: number
  timestamp: number
}

/**
 * Hook to fetch real-time energy data from Firebase
 * Path: energy/
 */
export function useEnergyData() {
  const [energy, setEnergy] = useState<EnergyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const energyRef = ref(rtdb, 'energy')
      
      const unsubscribe = onValue(
        energyRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            setEnergy({
              solar: data?.solar || 0,
              grid: data?.grid || 0,
              total: (data?.solar || 0) + (data?.grid || 0),
              timestamp: data?.timestamp || Date.now(),
            })
          } else {
            // No data in Firebase yet, use zeros
            setEnergy({
              solar: 0,
              grid: 0,
              total: 0,
              timestamp: Date.now(),
            })
          }
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('[useEnergyData] Error:', err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => off(energyRef)
    } catch (err: any) {
      console.error('[useEnergyData] Setup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  return { energy, loading, error }
}
