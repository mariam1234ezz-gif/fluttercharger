import { useState, useEffect } from 'react'
import { DoorEvent } from '@/types/door.types'
import { subscribeToDoorEvents } from '@/firebase/doorService'

/**
 * Hook to get real-time door events
 */
export function useDoorEvents(limit: number = 20) {
  const [events, setEvents] = useState<DoorEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Subscribe to real-time updates
    const unsubscribe = subscribeToDoorEvents(
      limit,
      (events: DoorEvent[]) => {
        setEvents(events)
        setLoading(false)
      }
    )

    // Cleanup on unmount
    return () => {
      unsubscribe()
    }
  }, [limit])

  return { events, loading, error }
}

/**
 * Hook to get door events for a specific station
 */
export function useStationDoorEvents(stationId: string, limit: number = 20) {
  const [events, setEvents] = useState<DoorEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!stationId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Import dynamically to avoid circular dependencies
    const { getDoorEventsForStation } = require('@/firebase/doorService')
    
    // Initial fetch
    getDoorEventsForStation(stationId, limit)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false))

    // Note: For real-time updates per station, you'd need to add a separate
    // subscription function. For now, we do an initial fetch.
  }, [stationId, limit])

  return { events, loading, error }
}