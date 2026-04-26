'use client'

import { useState, useEffect, useRef } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Station } from '@/types/station.types'
import { StationStatusExtension } from './StationStatusExtension'
import { DoorStatus, DoorTimerState, PENALTY_THRESHOLD_SECONDS } from '@/types/door.types'

interface DoorStatusCardProps {
  stationId: string
  stationName: string
  doorStatus: DoorStatus | null
  loading?: boolean
}

/**
 * Door Status Card Component
 * Displays real-time door status for a station with live timer
 */
export function DoorStatusCard({
  stationId,
  stationName,
  doorStatus,
  loading = false
}: DoorStatusCardProps) {
  const [station, setStation] = useState<Station | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate timer state based on elapsed time
  const getTimerState = (seconds: number): DoorTimerState => {
    if (seconds >= PENALTY_THRESHOLD_SECONDS) {
      return 'violation'
    } else if (seconds > PENALTY_THRESHOLD_SECONDS * 0.7) {
      // More than 70% of threshold (about 5 minutes)
      return 'warning'
    }
    return 'safe'
  }

  const timerState = getTimerState(elapsedSeconds)

  // Update elapsed time every second when door is open
  useEffect(() => {
    // subscribe to station document to fetch live metrics (voltage/current/temp/fan/charging)
    const stationRef = doc(db, 'stations', stationId)
    const unsubStation = onSnapshot(stationRef, (snap) => {
      if (snap.exists()) {
        setStation({ stationId: snap.id, ...(snap.data() as any) } as Station)
      }
    }, (err) => console.error('[DoorStatusCard] station subscription error:', err))

    if (doorStatus?.doorState === 'OPEN' && doorStatus.lastOpenedAt) {
      // Calculate initial elapsed time
      const openedAt = doorStatus.lastOpenedAt instanceof Date
        ? doorStatus.lastOpenedAt.getTime()
        : new Date(doorStatus.lastOpenedAt as unknown as string).getTime()
      
      const updateElapsed = () => {
        const now = Date.now()
        setElapsedSeconds(Math.floor((now - openedAt) / 1000))
      }

      // Initial update
      updateElapsed()

      // Set up interval
      intervalRef.current = setInterval(updateElapsed, 1000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      // Door is closed
      setElapsedSeconds(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      unsubStation()
    }
  }, [doorStatus?.doorState, doorStatus?.lastOpenedAt])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get status badge colors
  const getStatusColors = () => {
    if (doorStatus?.maintenanceMode) {
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500/50',
        label: 'MAINTENANCE'
      }
    }

    switch (doorStatus?.doorState) {
      case 'OPEN':
        switch (timerState) {
          case 'violation':
            return {
              bg: 'bg-red-500/20',
              text: 'text-red-400',
              border: 'border-red-500/50',
              label: 'VIOLATION'
            }
          case 'warning':
            return {
              bg: 'bg-amber-500/20',
              text: 'text-amber-400',
              border: 'border-amber-500/50',
              label: 'WARNING'
            }
          default:
            return {
              bg: 'bg-red-500/20',
              text: 'text-red-400',
              border: 'border-red-500/50',
              label: 'OPEN'
            }
        }
      case 'CLOSED':
      default:
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-400',
          border: 'border-emerald-500/50',
          label: 'CLOSED'
        }
    }
  }

  const statusColors = getStatusColors()

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-700 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div
      className={`
        bg-gray-800/50 border rounded-lg p-4 transition-all duration-300
        ${statusColors.border}
      `}
    >
      {/* Station Name & Status */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-300">{stationName}</h3>
          <p className="text-xs text-gray-500">ID: {stationId}</p>
        </div>
        <div className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${statusColors.bg} ${statusColors.text}
        `}>
          {statusColors.label}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center py-3">
        <div className={`
          text-3xl font-mono font-bold
          ${timerState === 'violation' ? 'text-red-500' :
            timerState === 'warning' ? 'text-amber-500' :
            doorStatus?.doorState === 'OPEN' ? 'text-red-400' : 'text-emerald-400'}
        `}>
          {formatTime(elapsedSeconds)}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {doorStatus?.doorState === 'OPEN' ? 'Door Open Duration' : 'Door Closed'}
        </p>
      </div>

      {/* User Info */}
      {doorStatus?.lastOpenedBy && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Opened by:</span>
            <span className="text-gray-300 font-medium">{doorStatus.lastOpenedBy}</span>
          </div>
        </div>
      )}

      {/* Maintenance Mode Indicator */}
      {doorStatus?.maintenanceMode && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            ⚙️ Station in maintenance mode
          </p>
        </div>
      )}

      {/* Live Station Metrics */}
      {station && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <StationStatusExtension station={station} />
        </div>
      )}
    </div>
  )
}

export default DoorStatusCard