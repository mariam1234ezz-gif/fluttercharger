export const dynamic = "force-dynamic";
git add .'use client'

import Header from '@/components/Header'
import { Card, StatCard, ProgressBar } from '@/components/Cards'
import { DataWidget, GaugeChart, ValueTable } from '@/components/Widgets'
import { Sun, Zap, Lightbulb } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import { mockEnergyData } from '@/lib/mockData'
import { formatNumber } from '@/lib/utils'

export default function EnergyMonitoring() {
  const totalEnergy = mockEnergyData.reduce((acc, d) => acc + d.totalInput, 0)
  const avgSolar = mockEnergyData.reduce((acc, d) => acc + d.solarInput, 0) / mockEnergyData.length
  const avgGrid = mockEnergyData.reduce((acc, d) => acc + d.gridInput, 0) / mockEnergyData.length
  const avgEfficiency = mockEnergyData.reduce((acc, d) => acc + d.efficiency, 0) / mockEnergyData.length

  // Energy flow visualization data
  const flowData = [
    { source: 'Solar Panel Array', energy: 420, percentage: 39.4 },
    { source: 'Grid Connection', energy: 645, percentage: 60.6 },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Energy Source Monitoring"
        description="Track solar generation and grid consumption in real-time"
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* Energy Source Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Solar Generation"
              value={formatNumber(avgSolar, 1)}
              icon={Sun}
              color="warning"
              unit="kWh average"
              trend={{ value: 18, positive: true }}
            />
            <StatCard
              label="Grid Supply"
              value={formatNumber(avgGrid, 1)}
              icon={Zap}
              color="info"
              unit="kWh average"
              trend={{ value: 5, positive: false }}
            />
            <StatCard
              label="Total Energy Input"
              value={formatNumber(totalEnergy, 1)}
              icon={Lightbulb}
              color="primary"
              unit="kWh today"
            />
            <StatCard
              label="System Efficiency"
              value={formatNumber(avgEfficiency, 1)}
              icon={Zap}
              color="success"
              unit="% average"
              trend={{ value: 2, positive: true }}
            />
          </div>

          {/* Detailed Energy Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Energy Sources */}
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">Current Energy Sources</h2>
              <div className="space-y-4">
                {flowData.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">{item.source}</span>
                      <span className={`text-sm font-bold ${idx === 0 ? 'text-yellow-400' : 'text-blue-400'}`}>
                        {formatNumber(item.energy, 1)} kWh
                      </span>
                    </div>
                    <ProgressBar
                      value={item.percentage}
                      max={100}
                      color={idx === 0 ? 'warning' : 'info'}
                      showValue={true}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-dark-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Solar Dependency</span>
                  <span className="text-yellow-400 font-semibold">39.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Grid Dependency</span>
                  <span className="text-blue-400 font-semibold">60.6%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cost Savings (Solar)</span>
                  <span className="text-green-400 font-semibold">$156.60</span>
                </div>
              </div>
            </Card>

            {/* Solar Metrics */}
            <Card className="flex flex-col items-center justify-center py-6">
              <h3 className="text-sm font-semibold text-white mb-4">Solar Performance</h3>
              <GaugeChart
                value={65}
                max={100}
                label="Capacity Utilization"
                color="warning"
              />
            </Card>

            {/* Grid Metrics */}
            <Card className="flex flex-col items-center justify-center py-6">
              <h3 className="text-sm font-semibold text-white mb-4">Grid Load Factor</h3>
              <GaugeChart
                value={45}
                max={100}
                label="Grid Draw Percentage"
                color="info"
              />
            </Card>
          </div>

          {/* Energy Input Over Time */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Energy Input Timeline</h2>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={mockEnergyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="timestamp" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} yAxisId="left" />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${formatNumber(Number(value), 1)} kWh`}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="solarInput"
                  fill="#f59e0b"
                  name="☀️ Solar Input"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="gridInput"
                  fill="#3b82f6"
                  name="⚡ Grid Input"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Efficiency %"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Energy Output */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Energy Output & Usage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockEnergyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="timestamp" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${formatNumber(Number(value), 1)} kWh`}
                />
                <Area
                  type="monotone"
                  dataKey="totalOutput"
                  stroke="#00d4ff"
                  fill="url(#colorOutput)"
                  fillOpacity={0.3}
                  name="Energy Output"
                />
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Power Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Solar Panel Array Status</h2>
              <ValueTable
                rows={[
                  { label: 'Current Generation', value: `${formatNumber(85, 1)} kW`, color: 'text-yellow-400' },
                  { label: 'Panel Temperature', value: '42°C', color: 'text-orange-400' },
                  { label: 'Panel Efficiency', value: '18.5%' },
                  { label: 'Grid Connection', value: 'Active', color: 'text-green-400' },
                  { label: 'Inverter Status', value: 'Normal' },
                  { label: 'Last Updated', value: '10:34 AM' },
                ]}
              />
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Grid Connection Status</h2>
              <ValueTable
                rows={[
                  { label: 'Grid Voltage', value: '380V', color: 'text-primary' },
                  { label: 'Grid Frequency', value: '50 Hz' },
                  { label: 'Current Draw', value: `${formatNumber(290, 1)} A`, color: 'text-blue-400' },
                  { label: 'Power Factor', value: '0.98', color: 'text-green-400' },
                  { label: 'Phase Balance', value: 'Good' },
                  { label: 'Last Updated', value: '10:34 AM' },
                ]}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
