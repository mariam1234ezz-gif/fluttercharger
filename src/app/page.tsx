'use client'

import Header from '@/components/Header'
import { StatCard, Card, Badge, Button, ProgressBar } from '@/components/Cards'
import { DataWidget, GaugeChart, ValueTable } from '@/components/Widgets'
import {
  Zap,
  Battery,
  Grid3x3,
  TrendingUp,
  Sun,
  Plug,
  AlertTriangle,
  DollarSign,
  Activity,
  Cpu,
  Power,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { mockDashboardStats, mockEnergyData, mockAlerts, mockChargerSlots } from '@/lib/mockData'
import { formatNumber, formatEnergy, formatCurrency, formatPercentage } from '@/lib/utils'

export default function Dashboard() {
  const stats = mockDashboardStats
  const energyData = mockEnergyData
  const alerts = mockAlerts.filter((a) => !a.resolved)
  const activeSessions = mockChargerSlots.filter((s) => s.status === 'charging').length

const energyMix = [
  { name: "Solar", value: 72.5, fill: "#f59e0b" },
  { name: "Grid", value: 109, fill: "#3b82f6" },
];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Station Overview"
        description="Real-time monitoring of your EV charging and swapping station"
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* Quick Stats Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Available Slots"
              value={stats.availableSlots}
              icon={Grid3x3}
              color="success"
              unit={`of ${stats.totalSlots} total`}
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              label="Active Charging"
              value={stats.activeChargingSessions}
              icon={Zap}
              color="primary"
              unit="sessions"
              trend={{ value: 8, positive: true }}
            />
            <StatCard
              label="Faulty Slots"
              value={stats.faultySlots}
              icon={AlertTriangle}
              color="danger"
              unit="requiring service"
            />
            <StatCard
              label="Daily Revenue"
              value={formatCurrency(stats.dailyRevenue)}
              icon={DollarSign}
              color="success"
              unit="earned today"
              trend={{ value: 15, positive: true }}
            />
          </div>

          {/* Quick Stats Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Energy Used"
              value={formatNumber(stats.totalEnergyConsumed, 1)}
              icon={Activity}
              color="info"
              unit="kWh today"
            />
            <StatCard
              label="Charged Batteries"
              value={stats.chargedBatteries}
              icon={Battery}
              color="success"
              unit={`available`}
            />
            <StatCard
              label="Empty Batteries"
              value={stats.emptyBatteries}
              icon={Battery}
              color="warning"
              unit="in queue"
            />
            <StatCard
              label="System Efficiency"
              value={formatPercentage(stats.systemEfficiency)}
              icon={Cpu}
              color="primary"
              unit="overall"
              trend={{ value: 3, positive: true }}
            />
          </div>

          {/* Main Grid - Energy & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Energy Distribution */}
            <Card className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-white mb-4">Energy Mix Today</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={energyMix}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {energyMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `${formatNumber(value, 1)} kWh`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">☀️ Solar</span>
                  <span className="text-yellow-400 font-semibold">{formatNumber(stats.solarContribution, 1)} kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">⚡ Grid</span>
                  <span className="text-blue-400 font-semibold">{formatNumber(stats.gridContribution, 1)} kWh</span>
                </div>
              </div>
            </Card>

            {/* Energy Over Time */}
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Energy Input Over Time</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="timestamp" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `${formatNumber(value, 1)} kWh`}
                  />
                  <Legend />
                  <Bar dataKey="solarInput" stackId="a" fill="#f59e0b" name="Solar Input" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gridInput" stackId="a" fill="#3b82f6" name="Grid Input" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Slot Status & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Slot Status Summary */}
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Slot Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Available</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-400">{stats.availableSlots}</span>
                    <ProgressBar
                      value={stats.availableSlots}
                      max={stats.totalSlots}
                      color="success"
                      showValue={false}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Charging</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{stats.occupiedSlots}</span>
                    <ProgressBar
                      value={stats.occupiedSlots}
                      max={stats.totalSlots}
                      color="primary"
                      showValue={false}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Faulty</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-400">{stats.faultySlots}</span>
                    <ProgressBar
                      value={stats.faultySlots}
                      max={stats.totalSlots}
                      color="danger"
                      showValue={false}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Alerts Summary */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
                <Badge variant="danger">{alerts.length}</Badge>
              </div>
              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-red-400">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No active alerts</p>
                )}
                {alerts.length > 3 && (
                  <Button variant="secondary" size="sm" className="w-full">
                    View All Alerts
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Battery Status & System Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex flex-col items-center justify-center py-6">
              <GaugeChart
                value={stats.systemEfficiency}
                max={100}
                label="System Efficiency"
                color="primary"
              />
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-4">Battery Inventory</h3>
              <ValueTable
                rows={[
                  { label: 'Charged', value: stats.chargedBatteries, color: 'text-green-400' },
                  { label: 'Empty', value: stats.emptyBatteries, color: 'text-yellow-400' },
                  { label: 'In Use', value: activeSessions, color: 'text-blue-400' },
                  { label: 'Faulty', value: '1', color: 'text-red-400' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-4">Today's Performance</h3>
              <ValueTable
                rows={[
                  { label: 'Sessions', value: '8 / 20' },
                  { label: 'Energy', value: `${formatNumber(stats.totalEnergyConsumed, 0)} kWh` },
                  { label: 'Uptime', value: '99.8%', color: 'text-green-400' },
                  { label: 'Avg Temp', value: '33°C', color: 'text-yellow-400' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-4">Power Status</h3>
              <ValueTable
                rows={[
                  { label: 'Solar Gen', value: `${formatNumber(stats.solarContribution, 0)} kWh` },
                  { label: 'Grid Draw', value: `${formatNumber(stats.gridContribution, 0)} kWh` },
                  { label: 'Load', value: `${formatNumber(activeSessions * 45, 0)} kW` },
                  { label: 'Status', value: 'Online', color: 'text-green-400' },
                ]}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
