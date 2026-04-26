'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Header from '@/components/Header'
import { Card, StatCard, AlertCard, ProgressBar, Badge, Button } from '@/components/Cards'
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
  AreaChart,
  Area,
} from 'recharts'
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
  Users,
  Upload,
  AlertCircle,
} from 'lucide-react'
import { formatNumber, formatEnergy, formatCurrency, formatPercentage } from '@/lib/utils'
import { useSensorsData } from '@/hooks/useSensors'
import { useUsersData } from '@/hooks/useUsers'
import { useEnergyData } from '@/hooks/useEnergy'

interface BatteryAlert {
  id: string
  type: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
}

export default function HomePage() {
  // Real-time data hooks
  const { sensors, loading: sensorsLoading, error: sensorsError } = useSensorsData()
  const { users, loading: usersLoading } = useUsersData()
  const { energy, loading: energyLoading } = useEnergyData()

  const [slotStatus, setSlotStatus] = useState({ available: 0, active: 0, faulty: 0 })
  const [batteries, setBatteries] = useState({ charged: 0, empty: 0, faulty: 0, total: 0 })
  const [alerts, setAlerts] = useState<BatteryAlert[]>([])
  const [energyHistory, setEnergyHistory] = useState<any[]>([])

  // Fetch energy history from Firestore for chart
  useEffect(() => {
    const historyRef = collection(db, 'energy_history')
    const unsubscribe = onSnapshot(
      historyRef,
      (snapshot) => {
        const history = snapshot.docs
          .map((doc) => ({
            timestamp: doc.id,
            solar: doc.data().solar || 0,
            grid: doc.data().grid || 0,
            time: new Date(parseInt(doc.id)).toLocaleTimeString(),
          }))
          .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp))
          .slice(-24) // Last 24 entries
        setEnergyHistory(history)
      },
      (err) => console.error('[Energy History] Error:', err)
    )
    return () => unsubscribe()
  }, [])

  // Fetch batteries from Firestore
  useEffect(() => {
    const batteriesRef = collection(db, 'batteries')
    const unsubscribe = onSnapshot(
      batteriesRef,
      (snapshot) => {
        let charged = 0,
          empty = 0,
          faulty = 0
        snapshot.docs.forEach((doc) => {
          const status = doc.data().status || 'empty'
          if (status === 'charged') charged++
          else if (status === 'empty') empty++
          else if (status === 'faulty') faulty++
        })
        setBatteries({ charged, empty, faulty, total: charged + empty + faulty })
      },
      (err) => console.error('[Batteries] Error:', err)
    )
    return () => unsubscribe()
  }, [])

  // Fetch charging slots from Firestore
  useEffect(() => {
    const slotsRef = collection(db, 'charging_slots')
    const unsubscribe = onSnapshot(
      slotsRef,
      (snapshot) => {
        let available = 0,
          active = 0,
          faulty = 0
        snapshot.docs.forEach((doc) => {
          const status = doc.data().status || 'available'
          if (status === 'available') available++
          else if (status === 'charging') active++
          else if (status === 'faulty') faulty++
        })
        setSlotStatus({ available, active, faulty })
      },
      (err) => console.error('[Slots] Error:', err)
    )
    return () => unsubscribe()
  }, [])

  // Fetch alerts from Firestore
  useEffect(() => {
    const alertsRef = collection(db, 'alerts')
    const unsubscribe = onSnapshot(
      alertsRef,
      (snapshot) => {
        const alertsList: BatteryAlert[] = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            type: doc.data().type || 'unknown',
            severity: doc.data().severity || 'info',
            message: doc.data().message || 'No message',
            timestamp: doc.data().timestamp || new Date().toISOString(),
          }))
          .filter((a) => !a.timestamp || new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          .slice(0, 3) // Top 3 alerts
        setAlerts(alertsList)
      },
      (err) => console.error('[Alerts] Error:', err)
    )
    return () => unsubscribe()
  }, [])

  // Calculate average voltage and temperature from sensors
  const avgVoltage = Object.values(sensors).length > 0 ? Math.round(Object.values(sensors).reduce((sum: number, s: any) => sum + (s.voltage || 0), 0) / Object.values(sensors).length) : 0
  const avgTemp = Object.values(sensors).length > 0 ? Math.round(Object.values(sensors).reduce((sum: number, s: any) => sum + (s.temperature || 0), 0) / Object.values(sensors).length * 10) / 10 : 0
  const avgSOC = Object.values(sensors).length > 0 ? Math.round(Object.values(sensors).reduce((sum: number, s: any) => sum + (s.soc || 0), 0) / Object.values(sensors).length) : 0

  // Calculate energy mix percentage
  const totalEnergy = (energy?.solar || 0) + (energy?.grid || 0)
  const solarPercent = totalEnergy > 0 ? Math.round((energy?.solar || 0) / totalEnergy * 100) : 0
  const gridPercent = totalEnergy > 0 ? 100 - solarPercent : 0

  const energyMixData = [
    { name: 'Solar', value: solarPercent, color: '#fbbf24' },
    { name: 'Grid', value: gridPercent, color: '#3b82f6' },
  ]

  if (sensorsLoading || energyLoading) {
    return (
      <div>
        <Header title="Dashboard" description="Loading real-time data..." />
        <main className="p-6">
          <div className="text-gray-400">Loading sensors and energy data...</div>
        </main>
      </div>
    )
  }

  if (sensorsError) {
    return (
      <div>
        <Header title="Dashboard" description="Error loading data" />
        <main className="p-6">
          <AlertCard
            title="Data Load Error"
            icon={AlertCircle}
            message={`Error: ${sensorsError}`}
            severity="critical"
          />
        </main>
      </div>
    )
  }

  return (
    <div>
      <Header title="Dashboard" description="System Overview & Real-Time Monitoring" />

      <main className="p-6 space-y-6">
        {/* Station Overview */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Station Overview</h2>
            <p className="text-gray-400 text-sm">Live system status and performance</p>
          </div>
          <Button variant="secondary" size="md" className="flex items-center gap-2">
            <Upload size={18} />
            Upload CSV
          </Button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Available Slots" value={slotStatus.available} icon={Grid3x3} color="success" />
          <StatCard label="Active Charging" value={slotStatus.active} icon={Plug} color="primary" trend={{ value: 12, positive: true }} />
          <StatCard label="Avg Voltage" value={`${avgVoltage}V`} icon={Zap} color="warning" />
          <StatCard label="Avg Temperature" value={`${avgTemp}°C`} icon={Activity} color="info" />
        </div>

        {/* Revenue & Users Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={users.length} icon={Users} color="info" />
          <StatCard label="Battery Inventory" value={batteries.total} icon={Battery} color="primary" />
          <StatCard label="Average SOC" value={`${avgSOC}%`} icon={Activity} color="success" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Energy Mix Pie Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Energy Mix</h3>
            {totalEnergy > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={energyMixData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {energyMixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-around mt-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">Solar</p>
                    <p className="text-yellow-400 font-bold">{solarPercent}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Grid</p>
                    <p className="text-blue-400 font-bold">{gridPercent}%</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">No energy data available</p>
            )}
          </Card>

          {/* Energy Input Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Energy Input Over Time</h3>
            {energyHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={energyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="solar" stackId="1" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="grid" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 py-8">No energy history available</p>
            )}
          </Card>
        </div>

        {/* Slot Status & Battery Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Charging Slots Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Available</span>
                  <span className="text-green-400 font-bold">{slotStatus.available}</span>
                </div>
                <ProgressBar value={slotStatus.available} max={12} color="success" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Active Charging</span>
                  <span className="text-blue-400 font-bold">{slotStatus.active}</span>
                </div>
                <ProgressBar value={slotStatus.active} max={12} color="primary" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Faulty</span>
                  <span className="text-red-400 font-bold">{slotStatus.faulty}</span>
                </div>
                <ProgressBar value={slotStatus.faulty} max={12} color="danger" />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Battery Inventory</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Battery size={20} className="text-green-400" />
                  <span className="text-gray-300">Charged & Ready</span>
                </div>
                <span className="text-white font-bold text-lg">{batteries.charged}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Battery size={20} className="text-blue-400" />
                  <span className="text-gray-300">Charging</span>
                </div>
                <span className="text-white font-bold text-lg">{batteries.empty}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Battery size={20} className="text-red-400" />
                  <span className="text-gray-300">Faulty</span>
                </div>
                <span className="text-white font-bold text-lg">{batteries.faulty}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-400" />
                Active Alerts
              </h3>
              <Badge variant="warning">{alerts.length} Active</Badge>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} title={alert.type} icon={AlertTriangle} message={alert.message} severity={alert.severity} />
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
