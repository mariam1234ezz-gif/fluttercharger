'use client'

import Header from '@/components/Header'
import { Card, Badge, Button, AlertCard } from '@/components/Cards'
import { AlertTriangle, Zap, Thermometer, AlertCircle, Wifi, RotateCcw, Clock, CheckCircle } from 'lucide-react'
import { mockAlerts, mockChargerSlots } from '@/lib/mockData'
import { useState } from 'react'

const alertTypesInfo = {
  overvoltage: { icon: Zap, name: 'Overvoltage', color: 'danger' },
  overcurrent: { icon: Zap, name: 'Overcurrent', color: 'danger' },
  overheating: { icon: Thermometer, name: 'Overheating', color: 'warning' },
  'short-circuit': { icon: AlertTriangle, name: 'Short Circuit', color: 'danger' },
  'system-failure': { icon: AlertCircle, name: 'System Failure', color: 'danger' },
  'communication-loss': { icon: Wifi, name: 'Communication Loss', color: 'warning' },
}

export default function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const activeAlerts = mockAlerts.filter((a) => !a.resolved)
  const resolvedAlerts = mockAlerts.filter((a) => a.resolved)

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Safety & Alerts"
        description="Monitor system health, faults, and emergency status"
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* Emergency Stop Button */}
          <Card className="bg-gradient-to-r from-red-600 to-red-700 border-red-500/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Emergency Control</h2>
                <p className="text-red-100 text-sm mt-1">Press to immediately stop all charging operations</p>
              </div>
              <Button variant="secondary" size="lg" className="bg-red-900 hover:bg-red-800">
                🛑 EMERGENCY STOP
              </Button>
            </div>
          </Card>

          {/* Alert Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Critical Alerts</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">
                    {activeAlerts.filter((a) => a.severity === 'critical').length}
                  </p>
                </div>
                <AlertTriangle size={40} className="text-red-500/30" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Warnings</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">
                    {activeAlerts.filter((a) => a.severity === 'warning').length}
                  </p>
                </div>
                <AlertCircle size={40} className="text-yellow-500/30" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Resolved Today</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">{resolvedAlerts.length}</p>
                </div>
                <CheckCircle size={40} className="text-green-500/30" />
              </div>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">System Health Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Power Supply', status: 'healthy', value: '380V AC ✓' },
                { label: 'Charging Units', status: 'error', value: '1/8 offline (Slot 5)' },
                { label: 'Temperature Control', status: 'warning', value: 'Slot 1: 36°C' },
                { label: 'Communication Network', status: 'warning', value: 'Slot 5: No signal' },
                { label: 'Solar Inverters', status: 'healthy', value: 'All operational' },
                { label: 'Battery Management', status: 'healthy', value: 'All packs monitored' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.status === 'healthy'
                      ? 'bg-green-500/10 border-green-500/20'
                      : item.status === 'error'
                        ? 'bg-red-500/10 border-red-500/20'
                        : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}
                >
                  <span className="text-gray-300">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        item.status === 'healthy'
                          ? 'text-green-400'
                          : item.status === 'error'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {item.value}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === 'healthy'
                          ? 'bg-green-400 animate-pulse'
                          : item.status === 'error'
                            ? 'bg-red-400 animate-pulse'
                            : 'bg-yellow-400 animate-pulse'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Alerts */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Active Alerts ({activeAlerts.length})</h2>
              <Badge variant="danger">{activeAlerts.length}</Badge>
            </div>

            <div className="space-y-3">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => {
                  const alertInfo =
                    alertTypesInfo[alert.type as keyof typeof alertTypesInfo] ||
                    alertTypesInfo['system-failure']
                  const IconComponent = alertInfo.icon
                  const severityColor =
                    alert.severity === 'critical'
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-yellow-500/10 border-yellow-500/20'
                  const textColor =
                    alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${severityColor}`}
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent size={20} className={`${textColor} flex-shrink-0 mt-1`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-semibold ${textColor}`}>{alertInfo.name}</h3>
                            <Badge variant={alert.severity === 'critical' ? 'danger' : 'warning'}>
                              {alert.severity === 'critical' ? 'CRITICAL' : 'WARNING'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {alert.slotId && (
                              <span>
                                📍 {
                                  mockChargerSlots.find((s) => s.id === alert.slotId)
                                    ?.slotNumber
                                }
                              </span>
                            )}
                            <span>🕐 {alert.timestamp}</span>
                          </div>
                        </div>
                        <Button variant="danger" size="sm" className="flex-shrink-0">
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle size={40} className="mx-auto mb-3 text-green-400" />
                  <p>All systems nominal - No active alerts</p>
                </div>
              )}
            </div>
          </Card>

          {/* Resolved Alerts */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Resolved Alerts</h2>
              <Badge variant="success">{resolvedAlerts.length}</Badge>
            </div>

            <div className="space-y-2">
              {resolvedAlerts.map((alert) => {
                const alertInfo =
                  alertTypesInfo[alert.type as keyof typeof alertTypesInfo] ||
                  alertTypesInfo['system-failure']
                const IconComponent = alertInfo.icon

                return (
                  <div key={alert.id} className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-green-400 font-medium">{alertInfo.name}</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Alert Details Panel */}
          {selectedAlert && (
            <Card className="border-2 border-primary">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Alert Details</h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-bg p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Alert Type</p>
                    <p className="text-primary font-semibold">
                      {
                        alertTypesInfo[selectedAlert.type as keyof typeof alertTypesInfo]
                          ?.name
                      }
                    </p>
                  </div>
                  <div className="bg-dark-bg p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Severity</p>
                    <p
                      className={`font-semibold ${
                        selectedAlert.severity === 'critical'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {selectedAlert.severity.toUpperCase()}
                    </p>
                  </div>
                  <div className="bg-dark-bg p-3 rounded-lg col-span-2">
                    <p className="text-gray-400 text-xs mb-1">Location</p>
                    <p className="text-primary font-semibold">
                      {selectedAlert.slotId
                        ? `Charging Slot ${
                            mockChargerSlots.find((s) => s.id === selectedAlert.slotId)
                              ?.slotNumber
                          }`
                        : 'System-wide'}
                    </p>
                  </div>
                </div>

                <div className="bg-dark-bg p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-2">Description</p>
                  <p className="text-gray-200">{selectedAlert.message}</p>
                </div>

                <div className="bg-dark-bg p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-2">Recommended Action</p>
                  <ul className="text-sm text-gray-200 space-y-1">
                    {selectedAlert.type === 'overheating' && (
                      <>
                        <li>✓ Check cooling system</li>
                        <li>✓ Reduce charging current</li>
                        <li>✓ Inspect battery contacts</li>
                      </>
                    )}
                    {selectedAlert.type === 'short-circuit' && (
                      <>
                        <li>✓ Isolate the charging unit immediately</li>
                        <li>✓ Check battery connectors</li>
                        <li>✓ Replace faulty charging unit</li>
                      </>
                    )}
                    {selectedAlert.type === 'communication-loss' && (
                      <>
                        <li>✓ Power cycle the unit</li>
                        <li>✓ Check network connection</li>
                        <li>✓ Inspect communication cables</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button variant="success" size="md" className="flex-1">
                    <CheckCircle size={16} />
                    Resolve Alert
                  </Button>
                  <Button variant="secondary" size="md" className="flex-1">
                    <Clock size={16} />
                    Snooze 30 min
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
