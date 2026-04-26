import { useState, useEffect } from 'react'
import { Station, DoorStatus } from '@/types/door.types'
import { subscribeToStationDoorStatus } from '@/firebase/doorService'

/**
 * Hook to get real-time door status for a station
 */
export function useDoorStatus(stationId: string) {
  const [doorStatus, setDoorStatus] = useState<DoorStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!stationId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStationDoorStatus(
      stationId,
      (station: Station | null) => {
        if (station) {
          setDoorStatus({
            doorState: station.currentDoorState,
            lastOpenedBy: station.lastOpenedBy,
            lastOpenedAt: station.lastOpenedAt,
            maintenanceMode: station.maintenanceMode
          })
        } else {
          setDoorStatus(null)
        }
        setLoading(false)
      }
    )

    // Cleanup on unmount
    return () => {
      unsubscribe()
    }
  }, [stationId])

  return { doorStatus, loading, error }
}

/**
 * Hook to get all stations' door status
 */
export function useAllDoorStatus() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Subscribe to all stations
    const { subscribeToAllStations } = require('@/firebase/doorService')
    const unsubscribe = subscribeToAllStations((stations: Station[]) => {
      setStations(stations)
      setLoading(false)
    })

    // Cleanup on unmount
    return () => {
      unsubscribe()
    }
  }, [])

  return { stations, loading, error }
}