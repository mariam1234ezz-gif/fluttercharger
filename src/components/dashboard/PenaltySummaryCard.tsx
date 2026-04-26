'use client'

import { Penalty, PENALTY_AMOUNT } from '@/types/door.types'

interface PenaltySummaryCardProps {
  userId: string
  penalties: Penalty[]
  total: number
  loading?: boolean
}

/**
 * Penalty Summary Card Component
 * Shows total penalties accumulated for a user
 */
export function PenaltySummaryCard({
  userId,
  penalties,
  total,
  loading = false
}: PenaltySummaryCardProps) {
  // Format timestamp
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return '-'
    
    const d = date instanceof Date
      ? date
      : new Date(date as unknown as string)
    
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="h-12 bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">Penalty Summary</h3>
        <p className="text-sm text-gray-500">User: {userId}</p>
      </div>

      {/* Total Amount */}
      <div className="p-6 text-center bg-gradient-to-br from-red-900/30 to-orange-900/20">
        <p className="text-sm text-gray-400 mb-1">Total Outstanding</p>
        <p className="text-4xl font-bold text-red-400">{total} EGP</p>
        <p className="text-xs text-gray-500 mt-2">
          {penalties.length} penalty{penalties.length !== 1 ? 'ies' : ''} total
        </p>
      </div>

      {/* Penalty List */}
      <div className="max-h-64 overflow-y-auto">
        {penalties.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-lg mb-2">✓</p>
            <p className="text-sm">No penalties recorded</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {penalties.map((penalty) => (
              <li key={penalty.id} className="p-4 hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">{penalty.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {penalty.stationId} • {formatDate(penalty.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-400">
                      {penalty.amount} EGP
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      {penalties.length > 0 && (
        <div className="p-4 border-t border-gray-700 bg-gray-900/30">
          <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
            View Payment Details
          </button>
        </div>
      )}
    </div>
  )
}

export default PenaltySummaryCard