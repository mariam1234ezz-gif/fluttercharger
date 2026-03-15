'use client'

import Header from '@/components/Header'
import { Card, Badge, Button, ProgressBar } from '@/components/Cards'
import { DataWidget } from '@/components/Widgets'
import { Battery, AlertTriangle, Zap, Activity } from 'lucide-react'
import { mockBatteries } from '@/lib/mockData'
import { useState } from 'react'

export default function BatteryManagement() {
  const [selectedBattery, setSelectedBattery] = useState<any>(null)

  const chargedBatteries = mockBatteries.filter((b) => b.status === 'charged')
  const emptyBatteries = mockBatteries.filter((b) => b.status === 'empty')
  const faultyBatteries = mockBatteries.filter((b) => b.status === 'faulty')
  const inUseBatteries = mockBatteries.filter((b) => b.status === 'in-use')

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Battery Swapping Management"
        description="Manage battery inventory and swapping operations"
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* Battery Inventory Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Fully Charged</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">{chargedBatteries.length}</p>
                </div>
                <Battery size={40} className="text-green-500/30" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Empty (Ready for Charge)</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">{emptyBatteries.length}</p>
                </div>
                <Zap size={40} className="text-yellow-500/30" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">In Use</p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">{inUseBatteries.length}</p>
                </div>
                <Activity size={40} className="text-blue-500/30" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Faulty (Maintenance)</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">{faultyBatteries.length}</p>
                </div>
                <AlertTriangle size={40} className="text-red-500/30" />
              </div>
            </Card>
          </div>

          {/* Charged Batteries - Ready for Deployment */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">✓ Charged & Ready for Deployment</h2>
            <div className="space-y-3">
              {chargedBatteries.length > 0 ? (
                chargedBatteries.map((battery) => (
                  <div
                    key={battery.id}
                    className="p-4 bg-dark-bg rounded-lg border border-green-500/20 hover:border-green-500/50 cursor-pointer transition-all"
                    onClick={() => setSelectedBattery(battery)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{battery.serialNumber}</p>
                        <p className="text-sm text-gray-400">{battery.type}</p>
                      </div>
                      <Badge variant="success">✓ Charged</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <DataWidget label="Capacity" value={battery.capacity} unit="kWh" size="sm" />
                      <DataWidget label="SOC" value={battery.soc} unit="%" size="sm" />
                      <DataWidget label="Health" value={battery.health} unit="%" size="sm" />
                    </div>
                    <Button variant="success" size="sm" className="w-full mt-3">
                      Deploy to Slot
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No fully charged batteries available</p>
              )}
            </div>
          </Card>

          {/* Empty Batteries - In Charging Queue */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">⚡ Empty - In Charging Queue</h2>
            <div className="space-y-3">
              {emptyBatteries.length > 0 ? (
                emptyBatteries.map((battery) => (
                  <div
                    key={battery.id}
                    className="p-4 bg-dark-bg rounded-lg border border-yellow-500/20 hover:border-yellow-500/50 cursor-pointer transition-all"
                    onClick={() => setSelectedBattery(battery)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{battery.serialNumber}</p>
                        <p className="text-sm text-gray-400">{battery.type}</p>
                      </div>
                      <Badge variant="warning">Charging</Badge>
                    </div>
                    <div className="mb-3">
                      <ProgressBar
                        value={battery.soc}
                        max={100}
                        label="Charging Progress"
                        color="warning"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <DataWidget label="Capacity" value={battery.capacity} unit="kWh" size="sm" />
                      <DataWidget label="SOC" value={battery.soc} unit="%" size="sm" />
                      <DataWidget label="Health" value={battery.health} unit="%" size="sm" />
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Est. 2h 15m remaining</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No empty batteries in queue</p>
              )}
            </div>
          </Card>

          {/* Faulty Batteries - Maintenance Required */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">⚠️ Faulty - Maintenance Required</h2>
            <div className="space-y-3">
              {faultyBatteries.length > 0 ? (
                faultyBatteries.map((battery) => (
                  <div
                    key={battery.id}
                    className="p-4 bg-dark-bg rounded-lg border border-red-500/20 hover:border-red-500/50 cursor-pointer transition-all"
                    onClick={() => setSelectedBattery(battery)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{battery.serialNumber}</p>
                        <p className="text-sm text-gray-400">{battery.type}</p>
                      </div>
                      <Badge variant="danger">Faulty</Badge>
                    </div>
                    <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400">
                      📋 LOW HEALTH: {battery.health}% - Needs maintenance
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <DataWidget label="Capacity" value={battery.capacity} unit="kWh" size="sm" />
                      <DataWidget label="SOC" value={battery.soc} unit="%" size="sm" />
                      <DataWidget label="Health" value={battery.health} unit="%" size="sm" />
                    </div>
                    <Button variant="danger" size="sm" className="w-full">
                      Send to Maintenance
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No faulty batteries</p>
              )}
            </div>
          </Card>

          {/* Swapping Operations Log */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Recent Swapping Operations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Battery</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Slot</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Operation</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Time</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  <tr className="hover:bg-dark-border/50">
                    <td className="px-4 py-3 font-semibold text-white">BT-LFP-2024-001</td>
                    <td className="px-4 py-3 text-gray-300">Slot 1</td>
                    <td className="px-4 py-3 text-gray-300">Inserted</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">10:15 AM</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">In Service</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-dark-border/50">
                    <td className="px-4 py-3 font-semibold text-white">BT-LFP-2024-002</td>
                    <td className="px-4 py-3 text-gray-300">Slot 4</td>
                    <td className="px-4 py-3 text-gray-300">Removed</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">09:45 AM</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">Completed</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-dark-border/50">
                    <td className="px-4 py-3 font-semibold text-white">BT-NCA-2024-001</td>
                    <td className="px-4 py-3 text-gray-300">Slot 7</td>
                    <td className="px-4 py-3 text-gray-300">Inserted</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">08:30 AM</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">In Service</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-dark-border/50">
                    <td className="px-4 py-3 font-semibold text-white">BT-LFP-2024-003</td>
                    <td className="px-4 py-3 text-gray-300">Slot 2</td>
                    <td className="px-4 py-3 text-gray-300">Removed</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">07:15 AM</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">Completed</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Battery Details Panel */}
          {selectedBattery && (
            <Card className="border-2 border-primary">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Battery Details</h2>
                <button
                  onClick={() => setSelectedBattery(null)}
                  className="text-gray-400 hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Serial Number</p>
                    <p className="font-monospace text-white font-semibold">{selectedBattery.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Battery Type</p>
                    <p className="text-white font-semibold">{selectedBattery.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DataWidget label="Capacity" value={selectedBattery.capacity} unit="kWh" />
                  <DataWidget label="State of Charge" value={selectedBattery.soc} unit="%" />
                  <DataWidget label="Health Status" value={selectedBattery.health} unit="%" />
                  <DataWidget label="Current Status" value={selectedBattery.status} unit="" />
                </div>

                <ProgressBar
                  value={selectedBattery.soc}
                  max={100}
                  label="Charge Level"
                  color={selectedBattery.soc > 80 ? 'success' : selectedBattery.soc > 50 ? 'primary' : 'warning'}
                />

                <ProgressBar
                  value={selectedBattery.health}
                  max={100}
                  label="Battery Health"
                  color={selectedBattery.health > 90 ? 'success' : selectedBattery.health > 80 ? 'primary' : 'warning'}
                />

                <div className="bg-dark-bg p-3 rounded-lg grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Last Used</p>
                    <p className="text-white font-semibold mt-1">Slot {selectedBattery.lastUsedSlot || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Cycle Count</p>
                    <p className="text-white font-semibold mt-1">{Math.floor(Math.random() * 500) + 200}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedBattery.status === 'charged' && (
                    <Button variant="success" size="md" className="flex-1">
                      Deploy to Slot
                    </Button>
                  )}
                  {selectedBattery.status === 'empty' && (
                    <Button variant="secondary" size="md" className="flex-1">
                      Queue for Charging
                    </Button>
                  )}
                  {selectedBattery.status === 'faulty' && (
                    <Button variant="danger" size="md" className="flex-1">
                      Maintenance Required
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
