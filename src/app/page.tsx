'use client'
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, limit, setDoc, getDocs, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'
import { ref, onValue } from "firebase/database";
import { db, auth, rtdb } from "@/lib/firebase";
import { useRouter } from 'next/navigation'
import Papa from 'papaparse';
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
  Users,
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
import { formatNumber, formatEnergy, formatCurrency, formatPercentage } from '@/lib/utils'

export default function Dashboard() {
  const router = useRouter()
  
  const [energyData, setEnergyData] = useState<{
    solar: number;
    grid: number;
    voltage: number;
    current: number;
  } | null>(null);

  const [batteries, setBatteries] = useState<{
    id: string;
    name: string;
    soc: number;
    status: string;
    type: string;
  }[]>([]);

  const [chartHistory, setChartHistory] = useState<{ time: string; solar: number; grid: number }[]>([]);

  const [usersCount, setUsersCount] = useState<number>(0);

  const [batteriesCount, setBatteriesCount] = useState<number>(0);

  const [file, setFile] = useState<File | null>(null);

  // Auth state check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const q = query(collection(db, "energy"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const entry = {
          solar: data.solar ?? 0,
          grid: data.grid ?? 0,
          voltage: data.voltage ?? 0,
          current: data.current ?? 0,
        };
        setEnergyData(entry);
        setChartHistory((prev) => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString(),
            solar: entry.solar,
            grid: entry.grid,
          },
        ]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "batteries"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          const soc = typeof d.soc === 'number' ? d.soc : parseInt(d.soc?.toString() ?? "0", 10) || 0;
          return {
            id: doc.id,
            name: d.name ?? doc.id,
            soc: soc,
            status: soc >= 80 ? "available" : "charging",
            type: ["battery1","battery2"].includes(doc.id) 
              ? "Lithium" : "Lead-Acid",
          };
        });
        setBatteries(data);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const usersRef = ref(rtdb, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsersCount(Object.keys(data).length);
      } else {
        setUsersCount(0);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "batteries"), (snapshot) => {
      setBatteriesCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  const uploadCSVToFirestore = async () => {
    if (!file) return;
    const text = await file.text();
    Papa.parse(text, {
      header: false,
      skipEmptyLines: true,
      complete: async (results) => {
        for (const row of results.data) {
          if (row.length < 2) continue;
          const name = row[0].toString().trim();
          const soc = parseFloat(row[1].toString().trim()) || 0;
          if (name) {
            await setDoc(doc(db, 'batteries', name), { name, soc }, { merge: true });
          }
        }
      },
    });
  };

  const simulateRealtimeUpdates = () => {
    setInterval(async () => {
      const snapshot = await getDocs(collection(db, 'batteries'));
      snapshot.forEach(async (docSnap) => {
        const newSoc = Math.floor(Math.random() * 100);
        await updateDoc(docSnap.ref, { soc: newSoc });
      });
    }, 5000);
  };

  if (!energyData) return <div>Loading...</div>;

  const alerts = [];

const energyMix = [
  { name: "Solar", value: energyData.solar, fill: "#f59e0b" },
  { name: "Grid", value: energyData.grid, fill: "#3b82f6" },
];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        title="Station Overview"
        description="Real-time monitoring of your EV charging and swapping station"
      />

      <div className="mb-4">
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={uploadCSVToFirestore} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Upload CSV to Firestore</button>
      </div>

      <main className="p-6 overflow-y-auto">
        <div className="space-y-6 max-w-7xl">
          {/* Quick Stats Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Available Slots"
              value={batteries.filter(b => b.status === "available").length}
              icon={Grid3x3}
              color="success"
              unit={`of ${batteries.length} total`}
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              label="Active Charging"
              value={batteries.filter(b => b.status === "charging").length}
              icon={Zap}
              color="primary"
              unit="sessions"
              trend={{ value: 8, positive: true }}
            />
            <StatCard
              label="Faulty Slots"
              value={0}
              icon={AlertTriangle}
              color="danger"
              unit="requiring service"
            />
            <StatCard
              label="Daily Revenue"
              value={formatCurrency(0)}
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
              value={formatNumber(energyData.solar + energyData.grid, 1)}
              icon={Activity}
              color="info"
              unit="kWh today"
            />
            <StatCard
              label="Charged Batteries"
              value={batteries.filter(b => b.status === "available").length}
              icon={Battery}
              color="success"
              unit={`available`}
            />
            <StatCard
              label="Empty Batteries"
              value={batteries.filter(b => b.status === "charging").length}
              icon={Battery}
              color="warning"
              unit="in queue"
            />
            <StatCard
              label="System Efficiency"
              value={formatPercentage(95)}
              icon={Cpu}
              color="primary"
              unit="overall"
              trend={{ value: 3, positive: true }}
            />
            <StatCard
              label="Total Users"
              value={usersCount}
              icon={Users}
              color="primary"
            />
            <StatCard
              label="Total Batteries"
              value={batteries.length}
              icon={Battery}
              color="success"
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
                    label={({ name, value }) => `${name}: ${value}`}
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
                  <span className="text-yellow-400 font-semibold">{formatNumber(energyData.solar, 1)} kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">⚡ Grid</span>
                  <span className="text-blue-400 font-semibold">{formatNumber(energyData.grid, 1)} kWh</span>
                </div>
              </div>
            </Card>

            {/* Energy Over Time */}
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Energy Input Over Time</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
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
                  <Bar dataKey="solar" stackId="a" fill="#f59e0b" name="Solar Input" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="grid" stackId="a" fill="#3b82f6" name="Grid Input" radius={[4, 4, 0, 0]} />
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
                    <span className="text-lg font-bold text-green-400">{batteries.filter(b => b.status === "available").length}</span>
                    <ProgressBar
                      value={batteries.filter(b => b.status === "available").length}
                      max={batteries.length}
                      color="success"
                      showValue={false}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Charging</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{batteries.filter(b => b.status === "charging").length}</span>
                    <ProgressBar
                      value={batteries.filter(b => b.status === "charging").length}
                      max={batteries.length}
                      color="primary"
                      showValue={false}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Faulty</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-400">{0}</span>
                    <ProgressBar
                      value={0}
                      max={batteries.length}
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
                value={95}
                max={100}
                label="System Efficiency"
                color="primary"
              />
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-4">Battery Inventory</h3>
              <ValueTable
                rows={[
                  { label: 'Charged', value: batteries.filter(b => b.status === "available").length, color: 'text-green-400' },
                  { label: 'Empty', value: batteries.filter(b => b.status === "charging").length, color: 'text-yellow-400' },
                  { label: 'In Use', value: batteries.filter(b => b.status === "charging").length, color: 'text-blue-400' },
                  { label: 'Faulty', value: '0', color: 'text-red-400' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-4">Today's Performance</h3>
              <ValueTable
                rows={[
                  { label: 'Sessions', value: '8 / 20' },
                  { label: 'Energy', value: `${formatNumber(energyData.solar + energyData.grid, 0)} kWh` },
                  { label: 'Uptime', value: '99.8%', color: 'text-green-400' },
                  { label: 'Avg Temp', value: '33°C', color: 'text-yellow-400' },
                ]}
              />
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-4">Power Status</h3>
              <ValueTable
                rows={[
                  { label: 'Solar Gen', value: `${formatNumber(energyData.solar, 0)} kWh` },
                  { label: 'Grid Draw', value: `${formatNumber(energyData.grid, 0)} kWh` },
                  { label: 'Load', value: `${formatNumber(batteries.filter(b => b.status === "charging").length * 45, 0)} kW` },
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
