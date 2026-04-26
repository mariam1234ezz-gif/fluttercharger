import { useState, useEffect, useMemo } from 'react'
import { Penalty } from '@/types/door.types'
import { subscribeToUserPenalties } from '@/firebase/doorService'

interface UseUserPenaltiesResult {
  penalties: Penalty[]
  total: number
  loading: boolean
  error: Error | null
}

/**
 * Hook to get real-time penalties for a user
 */
export function useUserPenalties(userId: string): UseUserPenaltiesResult {
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Calculate total penalty amount
  const total = useMemo(() => {
    return penalties.reduce((sum, penalty) => sum + penalty.amount, 0)
  }, [penalties])

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserPenalties(
      userId,
      (penalties: Penalty[]) => {
        setPenalties(penalties)
        setLoading(false)
      }
    )

    // Cleanup on unmount
    return () => {
      unsubscribe()
    }
  }, [userId])

  return { penalties, total, loading, error }
}

/**
 * Hook to get penalty count for a user
 */
export function usePenaltyCount(userId: string): number {
  const { penalties } = useUserPenalties(userId)
  return penalties.length
}

/**
 * Hook to check if user has any unpaid penalties
 */
export function useHasUnpaidPenalties(userId: string): boolean {
  const { penalties } = useUserPenalties(userId)
  return penalties.length > 0
}