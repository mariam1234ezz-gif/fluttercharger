'use client'

import Header from '@/components/Header'
import { Card, StatCard, Badge } from '@/components/Cards'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, DollarSign, Zap, Activity } from 'lucide-react'
import { mockReportData, mockDashboardStats } from '@/lib/mockData'
import { formatNumber, formatCurrency, formatEnergy } from '@/lib/utils'
import { useState } from 'react'

export default function Reports() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const totalSessions = mockReportData.reduce((acc, d) => acc + d.chargingSessions, 0)
  const totalEnergy = mockReportData.reduce((acc, d) => acc + d.energyConsumed, 0)
  const totalRevenue = mockReportData.reduce((acc, d) => acc + d.revenue, 0)
  const totalSolar = mockReportData.reduce((acc, d) => acc + d.solarGenerated, 0)

  const avgSessionValue = totalRevenue / totalSessions
  const solarPercentage = (totalSolar / totalEnergy) * 100

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Reports & Analytics"
        description="Comprehensive insights into station performance"
      />

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* Period Selector */}
          <Card>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                      period === p
                        ? 'bg-primary text-white'
                        : 'bg-dark-border text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {p} Report
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <Calendar size={16} className="inline mr-2" />
                Mar 3 - Mar 9, 2024
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Sessions"
              value={totalSessions}
              icon={Activity}
              color="primary"
              unit="charging"
            />
            <StatCard
              label="Energy Consumed"
              value={formatNumber(totalEnergy, 0)}
              icon={Zap}
              color="info"
              unit="kWh"
            />
            <StatCard
              label="Total Revenue"
              value={formatCurrency(totalRevenue)}
              icon={DollarSign}
              color="success"
              unit="earned"
            />
            <StatCard
              label="Solar Contribution"
          value={`${Number(solarPercentage).toFixed(1)}%`}
              icon={TrendingUp}
              color="warning"
              unit="% of energy"
            />
            <StatCard
              label="Avg Session Value"
         value={`$${Number(avgSessionValue).toFixed(2)}`}
              icon={DollarSign}
              color="success"
              unit="per session"
            />
          </div>

          {/* Charging Sessions Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Charging Sessions Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockReportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value} sessions`}
                />
                <Bar dataKey="chargingSessions" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Energy & Revenue Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Energy Consumption */}
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Energy Consumption Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockReportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `${formatNumber(Number(value), 0)} kWh`}
                  />
                  <Line
                    type="monotone"
                    dataKey="energyConsumed"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Daily Revenue</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockReportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Solar vs Grid Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Energy Source Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockReportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${formatNumber(Number(value), 0)} kWh`}
                />
                <Legend />
                <Bar dataKey="solarGenerated" stackId="a" fill="#f59e0b" name="☀️ Solar Generated" />
                <Bar
                  dataKey={(entry: any) => entry.energyConsumed - entry.solarGenerated}
                  stackId="a"
                  fill="#3b82f6"
                  name="⚡ Grid Consumed"
                  dataKey="gridConsumed"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Statistics */}
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Daily Performance</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Avg Sessions/Day</span>
                  <span className="text-primary font-semibold">
                    {formatNumber(totalSessions / mockReportData.length, 1)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Avg Energy/Day</span>
                  <span className="text-blue-400 font-semibold">
                 {(totalEnergy / mockReportData.length).toFixed(1)} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Avg Revenue/Day</span>
                  <span className="text-green-400 font-semibold">
                   ${(totalRevenue / mockReportData.length).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Peak Usage Time</span>
                  <span className="text-yellow-400 font-semibold">9 AM - 12 PM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Station Uptime</span>
                  <span className="text-green-400 font-semibold">99.8%</span>
                </div>
              </div>
            </Card>

            {/* Energy Statistics */}
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Energy Analysis</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Total Energy Used</span>
                  <span className="text-primary font-semibold">{formatNumber(totalEnergy, 0)} kWh</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Solar Generated</span>
                  <span className="text-yellow-400 font-semibold">{formatNumber(totalSolar, 0)} kWh</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Grid Consumed</span>
                  <span className="text-blue-400 font-semibold">
                    {formatNumber(totalEnergy - totalSolar, 0)} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Cost Savings (Solar)</span>
                  <span className="text-green-400 font-semibold">
                    ${((totalSolar / totalEnergy) * totalRevenue * 0.3).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Carbon Offset</span>
                  <span className="text-green-400 font-semibold">
                  {((totalSolar / 1000) * 0.45).toFixed(2)} tons CO₂
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Daily Report Table */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Detailed Daily Report</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Sessions</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Energy (kWh)</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Solar (kWh)</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Revenue</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-medium">Solar %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {mockReportData.map((day) => {
                    const solarPct = (day.solarGenerated / day.energyConsumed) * 100
                    return (
                      <tr key={day.date} className="hover:bg-dark-border/50">
                        <td className="px-4 py-3 font-semibold text-white">{day.date}</td>
                        <td className="px-4 py-3 text-gray-300">{day.chargingSessions}</td>
                        <td className="px-4 py-3 text-gray-300">{formatNumber(day.energyConsumed, 0)}</td>
                        <td className="px-4 py-3 text-yellow-400">{formatNumber(day.solarGenerated, 0)}</td>
                        <td className="px-4 py-3 text-green-400 font-semibold">{formatCurrency(day.revenue)}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={solarPct > 50 ? 'success' : solarPct > 30 ? 'warning' : 'info'}
                          >
                          {solarPct.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
