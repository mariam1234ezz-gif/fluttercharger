import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Alert } from '@/types/station.types'

export function useAlerts(maxAlerts = 50) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'alerts'),
      orderBy('timestamp', 'desc'),
      limit(maxAlerts)
    )

    const unsub = onSnapshot(
      q,
      (snap) => {
        setAlerts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Alert)))
        setLoading(false)
      },
      (err) => {
        console.error('[useAlerts] error:', err)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [maxAlerts])

  return { alerts, loading }
}
