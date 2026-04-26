'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Header from '@/components/Header'
import { Card, StatCard, Badge, Button, AlertCard, ProgressBar } from '@/components/Cards'
import { AlertTriangle, DoorOpen, DoorClosed, AlertCircle, Clock } from 'lucide-react'
import { useDoorsStatus } from '@/hooks/useDoors'

interface DoorEvent {
  id: string
  stationId: string
  timestamp: number
  action: 'OPEN' | 'CLOSED'
  duration?: number
  userId?: string
}

export default function DoorMonitoringPage() {
  const { doors, loading, error } = useDoorsStatus()
  const [events, setEvents] = useState<DoorEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [selectedStation, setSelectedStation] = useState<string | null>(null)

  // Fetch door events history
  useEffect(() => {
    const eventsRef = collection(db, 'door_events')
    const unsubscribe = onSnapshot(
      eventsRef,
      (snapshot) => {
        const eventsList: DoorEvent[] = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            stationId: doc.data().stationId || 'Unknown',
            timestamp: doc.data().timestamp || Date.now(),
            action: doc.data().action || 'CLOSED',
            duration: doc.data().duration,
            userId: doc.data().userId,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 50) // Last 50 events
        setEvents(eventsList)
        setEventsLoading(false)
      },
      (err) => {
        console.error('[Door Events] Error:', err)
        setEventsLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div>
        <Header title="Door Monitoring" description="Real-time door status and event tracking" />
        <main className="p-6">
          <div className="text-gray-400">Loading door sensors...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Door Monitoring" description="Real-time door status and event tracking" />
        <main className="p-6">
          <AlertCard title="Firebase Error" icon={AlertCircle} message={`Failed to load doors: ${error}`} severity="critical" />
        </main>
      </div>
    )
  }

  const openDoors = Object.entries(doors).filter(([_, status]) => status === 'OPEN')
  const openCount = openDoors.length
  const totalCount = Object.keys(doors).length

  return (
    <div>
      <Header title="Door Monitoring" description="Real-time door status and event tracking" />

      <main className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Total Doors" value={totalCount} icon={DoorClosed} color="info" />
          <StatCard label="Doors Open" value={openCount} icon={DoorOpen} color={openCount > 0 ? 'danger' : 'success'} />
          <StatCard label="Doors Closed" value={totalCount - openCount} icon={DoorClosed} color="success" />
        </div>

        {/* Alert if any doors are open */}
        {openCount > 0 && (
          <AlertCard
            title="⚠️ Doors Open"
            icon={AlertTriangle}
            message={`${openCount} door(s) currently open. Close them immediately to maintain security.`}
            severity="critical"
          />
        )}

        {/* Door Status Grid */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Door Status</h2>
          {totalCount > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(doors).map(([stationId, status]) => (
                <div
                  key={stationId}
                  onClick={() => setSelectedStation(stationId)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    status === 'OPEN'
                      ? 'bg-red-500/10 border-red-500/50 hover:border-red-500'
                      : 'bg-green-500/10 border-green-500/50 hover:border-green-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {status === 'OPEN' ? (
                      <DoorOpen size={24} className="text-red-400" />
                    ) : (
                      <DoorClosed size={24} className="text-green-400" />
                    )}
                    <div>
                      <p className="text-sm text-gray-300">Station {stationId}</p>
                      <Badge variant={status === 'OPEN' ? 'danger' : 'success'}>{status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No door sensors found in Firebase</p>
          )}
        </Card>

        {/* Door Events History */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={20} className="text-blue-400" />
            Door Events History
          </h2>
          {!eventsLoading ? (
            events.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Station</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events
                      .filter((e) => !selectedStation || e.stationId === selectedStation)
                      .map((event) => (
                        <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                          <td className="py-3 px-4 text-gray-300">{new Date(event.timestamp).toLocaleString()}</td>
                          <td className="py-3 px-4 text-white font-medium">Station {event.stationId}</td>
                          <td className="py-3 px-4">
                            <Badge variant={event.action === 'OPEN' ? 'warning' : 'success'}>{event.action}</Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{event.duration ? `${(event.duration / 60).toFixed(1)}s` : '-'}</td>
                          <td className="py-3 px-4 text-gray-300">{event.userId || 'System'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">No door events recorded</p>
            )
          ) : (
            <p className="text-center text-gray-400 py-8">Loading events...</p>
          )}
        </Card>

        {/* Violation Rules */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Door Violation Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="font-semibold text-green-400 mb-2">✓ Normal Operation</p>
              <p className="text-sm text-gray-300">Door closed within normal operation window</p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="font-semibold text-yellow-400 mb-2">⚠ Warning Zone (5-7 min)</p>
              <p className="text-sm text-gray-300">Door open too long - Alert generated</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="font-semibold text-red-400 mb-2">✕ Violation (7+ min)</p>
              <p className="text-sm text-gray-300">Door open violation - Penalty applied</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}