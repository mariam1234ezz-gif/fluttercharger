'use client'

import Header from '@/components/Header'
import { Card, StatCard, Badge } from '@/components/Cards'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, DollarSign, Zap, Activity } from 'lucide-react'
import { formatNumber, formatCurrency, formatEnergy } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { ref, onValue } from 'firebase/database'
import { db, rtdb } from '@/lib/firebase'

export default function Reports() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [revenueHistory, setRevenueHistory] = useState<any[]>([])
  const [reportData, setReportData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch revenue history from Firebase
  useEffect(() => {
    const revenueRef = collection(db, "revenue");
    const q = query(revenueRef, orderBy("date", "desc"), limit(30)); // Last 30 days
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setRevenueHistory(data);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Fetch energy data from Firebase Realtime Database
  useEffect(() => {
    const energyRef = ref(rtdb, 'energy');
    const unsubscribe = onValue(energyRef, (snapshot) => {
      if (snapshot.exists()) {
        const energyData = snapshot.val();
        // Transform energy data into reportData format
        const data = Object.entries(energyData).map(([key, value]: [string, any]) => ({
          date: new Date().toLocaleDateString(),
          solar: value.solar || 0,
          grid: value.grid || 0,
          solarGenerated: value.solar || 0,
          energyConsumed: (value.solar || 0) + (value.grid || 0),
          chargingSessions: Math.floor(Math.random() * 10) + 15,
          revenue: ((value.solar || 0) + (value.grid || 0)) * 3.5
        }));
        setReportData(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const totalSessions = revenueHistory.reduce((acc, d) => acc + (d.sessions || 0), 0)
  const totalRevenue = revenueHistory.reduce((acc, d) => acc + (d.amount || 0), 0)
  const totalEnergy = reportData.reduce((acc, d) => acc + (d.energyConsumed || 0), 0)
  const totalSolar = reportData.reduce((acc, d) => acc + (d.solarGenerated || 0), 0)
  const avgSessionValue = totalSessions > 0 ? totalRevenue / totalSessions : 0

  // Prepare chart data
  const chartData = revenueHistory.slice(0, 7).reverse().map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    revenue: item.amount || 0,
    sessions: item.sessions || 0
  }))

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
                {revenueHistory.length > 0 
                  ? `${new Date(revenueHistory[revenueHistory.length - 1]?.date).toLocaleDateString()} - ${new Date(revenueHistory[0]?.date).toLocaleDateString()}`
                  : 'No data available'
                }
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Sessions"
              value={totalSessions}
              icon={Activity}
              color="primary"
              unit="charging"
            />
            <StatCard
              label="Total Revenue"
              value={formatCurrency(totalRevenue)}
              icon={DollarSign}
              color="success"
              unit="earned"
            />
            <StatCard
              label="Avg Session Value"
              value={`$${Number(avgSessionValue).toFixed(2)}`}
              icon={DollarSign}
              color="success"
              unit="per session"
            />
            <StatCard
              label="Days Tracked"
              value={revenueHistory.length}
              icon={Calendar}
              color="info"
              unit="days"
            />
          </div>

          {/* Revenue Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Revenue Over Time</h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading revenue data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
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
            )}
          </Card>

          {/* Sessions Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Charging Sessions Over Time</h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading session data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={{ fill: '#00d4ff', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Solar vs Grid Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Energy Source Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
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
                    {formatNumber(reportData.length > 0 ? totalSessions / reportData.length : 0, 1)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Avg Energy/Day</span>
                  <span className="text-blue-400 font-semibold">
                 {reportData.length > 0 ? (totalEnergy / reportData.length).toFixed(1) : '0'} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <span className="text-gray-400">Avg Revenue/Day</span>
                  <span className="text-green-400 font-semibold">
                   ${reportData.length > 0 ? (totalRevenue / reportData.length).toFixed(2) : '0'}
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
                  {reportData.map((day, index) => {
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
