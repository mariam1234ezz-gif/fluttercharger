import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Station } from '@/types/station.types'

export function useStations() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'stations'),
      (snap) => {
        setStations(snap.docs.map(d => ({ stationId: d.id, ...(d.data() as any) } as Station)))
        setLoading(false)
      },
      (err) => {
        console.error('[useStations] error:', err)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [])

  return { stations, loading }
}
