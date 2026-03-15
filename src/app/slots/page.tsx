'use client'

import Header from '@/components/Header'
import { Card, Badge, Button, ProgressBar } from '@/components/Cards'
import { DataWidget } from '@/components/Widgets'
import { Play, Square, Activity, AlertTriangle, Zap } from 'lucide-react'
import { mockChargerSlots } from '@/lib/mockData'
import { useState } from 'react'
import { formatNumber, getStatusColor, getStatusBgColor } from '@/lib/utils'

export default function SlotManagement() {
  const [mode, setMode] = useState<'grid' | 'list'>('grid')
  const [selectedSlot, setSelectedSlot] = useState<any>(null)

  const availableSlots = mockChargerSlots.filter((s) => s.status === 'available')
  const chargingSlots = mockChargerSlots.filter((s) => s.status === 'charging')
  const faultySlots = mockChargerSlots.filter((s) => s.status === 'faulty')

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Charging Slot Management"
        description="Monitor and control all charging slots in real-time"
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* Slot Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Available</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">{availableSlots.length}</p>
                </div>
                <div className="text-4xl">✓</div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Charging</p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">{chargingSlots.length}</p>
                </div>
                <Zap size={40} className="text-blue-500/30" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Faulty</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">{faultySlots.length}</p>
                </div>
                <AlertTriangle size={40} className="text-red-500/30" />
              </div>
            </Card>
          </div>

          {/* View Controls */}
          <Card>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    mode === 'grid'
                      ? 'bg-primary text-white'
                      : 'bg-dark-border text-gray-400 hover:text-gray-200'
                  }`}
                >
                  🔲 Grid View
                </button>
                <button
                  onClick={() => setMode('list')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    mode === 'list'
                      ? 'bg-primary text-white'
                      : 'bg-dark-border text-gray-400 hover:text-gray-200'
                  }`}
                >
                  📋 List View
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Total Slots: {mockChargerSlots.length}</span>
              </div>
            </div>
          </Card>

          {/* Grid View */}
          {mode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockChargerSlots.map((slot) => (
                <Card
                  key={slot.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedSlot?.id === slot.id
                      ? 'border-primary border-2 ring-2 ring-primary/20'
                      : ''
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className="space-y-3">
                    {/* Slot Number & Status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500">CHARGING SLOT</p>
                        <p className="text-3xl font-bold text-primary mt-1">{slot.slotNumber}</p>
                      </div>
                      <Badge
                        variant={
                          slot.status === 'available'
                            ? 'success'
                            : slot.status === 'charging'
                              ? 'info'
                              : 'danger'
                        }
                      >
                        {slot.status === 'available'
                          ? '⭘ Available'
                          : slot.status === 'charging'
                            ? '⚡ Charging'
                            : '⚠️ Faulty'}
                      </Badge>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dark-border" />

                    {/* Info */}
                    {slot.status === 'charging' && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">{slot.batteryType}</span>
                            <span className="text-primary font-semibold">
                              {formatNumber(slot.power, 1)} kW
                            </span>
                          </div>
                          <ProgressBar
                            value={slot.batterySOC}
                            max={100}
                            color={
                              slot.batterySOC > 75
                                ? 'success'
                                : slot.batterySOC > 50
                                  ? 'primary'
                                  : 'warning'
                            }
                            showValue={true}
                          />
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-gray-400">
                              V: <span className="text-white font-semibold">{slot.voltage}V</span>
                            </div>
                            <div className="text-gray-400">
                              A: <span className="text-white font-semibold">{slot.current}A</span>
                            </div>
                            <div className="text-gray-400">
                              T:{' '}
                              <span
                                className={`font-semibold ${
                                  slot.temperature > 40
                                    ? 'text-yellow-400'
                                    : 'text-white'
                                }`}
                              >
                                {slot.temperature}°C
                              </span>
                            </div>
                            <div className="text-gray-400">
                              {slot.chargingMode === 'fast' ? '⚡ Fast' : '🔌 Normal'}
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" className="flex-1">
                            <Play size={14} />
                          </Button>
                          <Button variant="danger" size="sm" className="flex-1">
                            <Square size={14} />
                          </Button>
                        </div>
                      </>
                    )}

                    {slot.status === 'available' && (
                      <Button variant="success" size="sm" className="w-full">
                        <Play size={14} />
                        Start Charging
                      </Button>
                    )}

                    {slot.status === 'faulty' && (
                      <>
                        <p className="text-xs text-red-400 font-medium">⚠️ Requires Service</p>
                        <Button variant="secondary" size="sm" className="w-full">
                          View Details
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {mode === 'list' && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Slot</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Battery</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Metrics</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">SOC</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {mockChargerSlots.map((slot) => (
                      <tr
                        key={slot.id}
                        className="hover:bg-dark-border/50 transition-colors"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-bold text-primary">#{slot.slotNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              slot.status === 'available'
                                ? 'success'
                                : slot.status === 'charging'
                                  ? 'info'
                                  : 'danger'
                            }
                          >
                            {slot.status === 'available'
                              ? 'Available'
                              : slot.status === 'charging'
                                ? 'Charging'
                                : 'Faulty'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{slot.batteryType}</td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>V: {slot.voltage}V | A: {slot.current}A</div>
                            <div>P: {formatNumber(slot.power, 1)}kW | T: {slot.temperature}°C</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ProgressBar
                              value={slot.batterySOC}
                              max={100}
                              color="primary"
                              showValue={false}
                            />
                            <span className="text-primary font-semibold text-sm">
                              {slot.batterySOC}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {slot.status === 'charging' && (
                              <>
                                <Button variant="secondary" size="sm">
                                  <Play size={14} />
                                </Button>
                                <Button variant="danger" size="sm">
                                  <Square size={14} />
                                </Button>
                              </>
                            )}
                            {slot.status === 'available' && (
                              <Button variant="success" size="sm">
                                <Play size={14} />
                              </Button>
                            )}
                            {slot.status === 'faulty' && (
                              <Button variant="secondary" size="sm">Info</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Selected Slot Details */}
          {selectedSlot && (
            <Card className="border-2 border-primary">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Slot {selectedSlot.slotNumber} Details</h2>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="text-gray-400 hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <DataWidget
                  label="Voltage"
                  value={selectedSlot.voltage}
                  unit="V"
                />
                <DataWidget
                  label="Current"
                  value={selectedSlot.current}
                  unit="A"
                />
                <DataWidget
                  label="Power"
                  value={formatNumber(selectedSlot.power, 1)}
                  unit="kW"
                />
                <DataWidget
                  label="Temperature"
                  value={selectedSlot.temperature}
                  unit="°C"
                />
              </div>

              {selectedSlot.status === 'charging' && (
                <>
                  <ProgressBar
                    value={selectedSlot.batterySOC}
                    max={100}
                    label="Battery State of Charge"
                    color={
                      selectedSlot.batterySOC > 75
                        ? 'success'
                        : selectedSlot.batterySOC > 50
                          ? 'primary'
                          : 'warning'
                    }
                  />
                  <div className="mt-4 p-3 bg-dark-bg rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Charging Mode</p>
                        <p className="text-white font-semibold mt-1">
                          {selectedSlot.chargingMode === 'fast' ? '⚡ Fast Charging' : '🔌 Normal Charging'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Est. Time Remaining</p>
                        <p className="text-white font-semibold mt-1">
                          {selectedSlot.estimatedEndTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 flex gap-2">
                {selectedSlot.status === 'charging' && (
                  <>
                    <Button variant="secondary" size="md" className="flex-1">
                      <Play size={16} />
                      Resume
                    </Button>
                    <Button variant="secondary" size="md" className="flex-1">
                      Switch to Fast Mode
                    </Button>
                    <Button variant="danger" size="md" className="flex-1">
                      <Square size={16} />
                      Stop Charging
                    </Button>
                  </>
                )}
                {selectedSlot.status === 'available' && (
                  <>
                    <Button variant="success" size="md" className="flex-1">
                      <Play size={16} />
                      Start Fast Charge
                    </Button>
                    <Button variant="success" size="md" className="flex-1">
                      <Play size={16} />
                      Start Normal Charge
                    </Button>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
