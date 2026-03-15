'use client'

import Header from '@/components/Header'
import { Card, Badge, Button, ProgressBar } from '@/components/Cards'
import { DataWidget, MetricRow } from '@/components/Widgets'
import { AlertTriangle, Play, Square } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { mockChargerSlots, mockEnergyData } from '@/lib/mockData'
import { formatNumber, formatVoltage, formatCurrent, formatTemperature, getTemperatureStatus } from '@/lib/utils'

export default function Monitoring() {
  const slots = mockChargerSlots.filter((s) => s.status !== 'available')
  const activeSlots = mockChargerSlots.filter((s) => s.status === 'charging')

  // Generate mock data for voltage/current trends
  const trendData = [
    { time: '09:00', voltage: 375, current: 95, power: 35.6, temp: 28 },
    { time: '09:15', voltage: 378, current: 98, power: 37.0, temp: 29 },
    { time: '09:30', voltage: 380, current: 102, power: 38.8, temp: 30 },
    { time: '09:45', voltage: 382, current: 110, power: 42.0, temp: 32 },
    { time: '10:00', voltage: 380, current: 115, power: 43.7, temp: 33 },
    { time: '10:15', voltage: 381, current: 125, power: 47.6, temp: 35 },
    { time: '10:30', voltage: 384, current: 120, power: 46.1, temp: 34 },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header title="Real-Time Monitoring" description="Live monitoring of all active charging sessions" />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* System Overview */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">System Metrics</h2>
            <MetricRow
              metrics={[
                {
                  label: 'Total Voltage',
                  value: formatVoltage(0),
                  unit: 'AC Supply',
                  status: 'normal',
                },
                {
                  label: 'Total Current',
                  value: formatCurrent(450),
                  unit: 'All Slots',
                  status: 'normal',
                },
                {
                  label: 'Total Power',
                  value: formatNumber(172, 1),
                  unit: 'kW',
                  status: 'normal',
                },
                {
                  label: 'Avg Temperature',
                  value: formatTemperature(90.5),
                  unit: 'System',
                  status: 'normal',
                },
              ]}
            />
          </Card>

          {/* Voltage & Current Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Voltage Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[370, 390]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => formatVoltage(Number(value))}
                  />
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={{ fill: '#00d4ff', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Power Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `${formatNumber(Number(value), 1)} kW`}
                  />
                  <Area
                    type="monotone"
                    dataKey="power"
                    stroke="#10b981"
                    fill="url(#colorPower)"
                    fillOpacity={0.3}
                  />
                  <defs>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Temperature Monitoring */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Temperature Monitoring</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[20, 50]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => formatTemperature(Number(value))}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Active Charging Sessions */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Active Charging Sessions</h2>
            <div className="space-y-4">
              {activeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-dark-bg p-4 rounded-lg border border-dark-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                        {slot.slotNumber}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Slot {slot.slotNumber}</h3>
                        <p className="text-sm text-gray-400">{slot.batteryType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={slot.chargingMode === 'fast' ? 'danger' : 'info'}>
                        {slot.chargingMode === 'fast' ? '⚡ Fast' : '🔌 Normal'}
                      </Badge>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <DataWidget
                      label="Voltage"
                      value={slot.voltage}
                      unit="V"
                      size="sm"
                    />
                    <DataWidget
                      label="Current"
                      value={slot.current}
                      unit="A"
                      size="sm"
                    />
                    <DataWidget
                      label="Power"
                      value={formatNumber(slot.power, 1)}
                      unit="kW"
                      size="sm"
                    />
                    <DataWidget
                      label="Temp"
                      value={slot.temperature}
                      unit="°C"
                      status={getTemperatureStatus(slot.temperature)}
                      size="sm"
                    />
                  </div>

                  {/* SOC Progress */}
                  <div className="space-y-3">
                    <ProgressBar
                      value={slot.batterySOC}
                      max={100}
                      label={`State of Charge (SOC)`}
                      color={slot.batterySOC > 80 ? 'success' : slot.batterySOC > 50 ? 'primary' : 'warning'}
                      showValue={true}
                    />

                    {/* Session Info */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-dark-border/50 p-2 rounded">
                        <p className="text-gray-400">Start Time</p>
                        <p className="text-primary font-semibold">{slot.startTime}</p>
                      </div>
                      <div className="bg-dark-border/50 p-2 rounded">
                        <p className="text-gray-400">Est. End Time</p>
                        <p className="text-blue-400 font-semibold">{slot.estimatedEndTime}</p>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Play size={16} />
                        Resume
                      </Button>
                      <Button variant="danger" size="sm" className="flex-1">
                        <Square size={16} />
                        Stop
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
