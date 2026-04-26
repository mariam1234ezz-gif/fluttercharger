'use client'

import { useState, useEffect } from 'react'
import { DoorEvent, PENALTY_AMOUNT } from '@/types/door.types'

interface DoorEventsTableProps {
  events?: DoorEvent[]
  loading?: boolean
  onRefresh?: () => void
}

/**
 * Door Events Table Component
 * Displays recent door events with real-time updates
 */
export function DoorEventsTable({
  events = [],
  loading = false,
  onRefresh
}: DoorEventsTableProps) {
  // Format timestamp to readable date
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return '-'
    
    const d = date instanceof Date
      ? date
      : new Date(date as unknown as string)
    
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format duration to readable time
  const formatDuration = (seconds: number | null | undefined): string => {
    if (seconds === null || seconds === undefined) return '-'
    
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    
    if (mins > 0) {
      return `${mins}m ${secs}s`
    }
    return `${secs}s`
  }

  // Get status badge styles
  const getStatusBadge = (status: DoorEvent['status']) => {
    switch (status) {
      case 'open':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          label: 'OPEN'
        }
      case 'violation':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          label: 'VIOLATION'
        }
      case 'closed_normal':
      default:
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-400',
          label: 'NORMAL'
        }
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="h-5 bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-700/50 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200">Door Events</h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            ↻ Refresh
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Station
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Open Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Penalty
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No door events recorded yet
                </td>
              </tr>
            ) : (
              events.map((event) => {
                const badge = getStatusBadge(event.status)
                return (
                  <tr key={event.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {event.stationId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {event.userId || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDate(event.openedAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDuration(event.durationSeconds)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`
                        inline-flex px-2 py-1 text-xs font-medium rounded-full
                        ${badge.bg} ${badge.text}
                      `}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {event.penaltyApplied ? (
                        <span className="text-red-400 font-medium">{PENALTY_AMOUNT} EGP</span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {events.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/30">
          <p className="text-xs text-gray-500">
            Showing {events.length} most recent events
          </p>
        </div>
      )}
    </div>
  )
}

export default DoorEventsTable