'use client'
import Footer from "@/components/Footer";
import { mockEnergyData, mockChargerSlots } from '@/lib/mockData'
import Header from '@/components/Header'
import { Card, Badge, Button, ProgressBar } from '@/components/Cards'
import { DataWidget } from '@/components/Widgets'
import { Play, Square } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function Monitoring() {

  const totalSolar = mockEnergyData.reduce((acc, d) => acc + d.solar, 0)
  const totalGrid = mockEnergyData.reduce((acc, d) => acc + d.grid, 0)

  const activeSlots = mockChargerSlots.filter((s) => s.status === 'charging')

  const trendData = [
    { time: '09:00', voltage: 375, current: 95, power: 36.0 },
    { time: '09:15', voltage: 378, current: 98, power: 37.0 },
    { time: '09:30', voltage: 380, current: 102, power: 38.8 },
    { time: '09:45', voltage: 382, current: 110, power: 42.0 },
    { time: '10:00', voltage: 380, current: 115, power: 43.7 },
  ]

  const totalEnergy = totalSolar + totalGrid
  const solarPercent = totalEnergy ? ((totalSolar / totalEnergy) * 100).toFixed(1) : 0
  const gridPercent = totalEnergy ? ((totalGrid / totalEnergy) * 100).toFixed(1) : 0

  const donutData =
    totalEnergy === 0
      ? [
          { name: 'Solar', value: 1 },
          { name: 'Grid', value: 1 },
        ]
      : [
          { name: 'Solar', value: totalSolar },
          { name: 'Grid', value: totalGrid },
        ]

  const DONUT_COLORS = ['#f59e0b', '#3b82f6']

  return (
    
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Real-Time Monitoring"
        description="Live monitoring of all active charging sessions"
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">

          {/* Voltage Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Voltage Trend</h2>

            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="voltage" stroke="#00d4ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Voltage & Power */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Voltage Trend</h2>
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Line type="monotone" dataKey="voltage" stroke="#00d4ff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Power Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="power"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

          </div>

          {/* Energy Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Energy Mix Today</h2>

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-yellow-400">
                  <span>Solar</span>
                  <span>{totalSolar} kWh ({solarPercent}%)</span>
                </div>
                <div className="flex justify-between text-blue-400">
                  <span>Grid</span>
                  <span>{totalGrid} kWh ({gridPercent}%)</span>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Energy Input Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockEnergyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="solar" stroke="#f59e0b" />
                  <Line type="monotone" dataKey="grid" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

          </div>

          {/* Active Sessions */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Active Charging Sessions</h2>

            <div className="space-y-4">
              {activeSlots.map((slot) => (
                <div key={slot.id} className="bg-dark-bg p-4 rounded-lg border border-dark-border">

                  <div className="flex justify-between mb-3">
                    <h3 className="text-white font-semibold">Slot {slot.id}</h3>
                    <Badge>{slot.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <DataWidget label="Voltage" value={slot.voltage || 0} unit="V" />
                    <DataWidget label="Current" value={slot.current || 0} unit="A" />
                  </div>

                  <ProgressBar value={slot.soc || 0} max={100} />

                  <div className="flex gap-2 mt-3">
                    <Button className="flex-1">
                      <Play size={16} /> Resume
                    </Button>
                    <Button variant="danger" className="flex-1">
                      <Square size={16} /> Stop
                    </Button>
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