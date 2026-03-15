'use client'

import Header from '@/components/Header'
import { Card } from '@/components/Cards'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const energyData = [
  { time: '09:00', power: 120 },
  { time: '09:15', power: 135 },
  { time: '09:30', power: 150 },
  { time: '09:45', power: 160 },
  { time: '10:00', power: 145 },
  { time: '10:15', power: 170 },
  { time: '10:30', power: 180 }
]

export default function EnergyPage() {
  return (
    <div className="space-y-6">

      <Header
        title="Energy Monitoring"
        subtitle="Real-time energy consumption of the charging station"
      />

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">

        <Card title="Voltage">
          <div className="text-2xl text-cyan-400">380 V</div>
        </Card>

        <Card title="Current">
          <div className="text-2xl text-cyan-400">450 A</div>
        </Card>

        <Card title="Power">
          <div className="text-2xl text-cyan-400">172 kW</div>
        </Card>

        <Card title="Battery SOC">
          <div className="text-2xl text-cyan-400">82%</div>
        </Card>

      </div>

      {/* Graph */}

      <Card title="Energy Consumption">

        <div style={{ width: '100%', height: 300 }}>

          <ResponsiveContainer>

            <LineChart data={energyData}>

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="power"
                stroke="#00e5ff"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </Card>

    </div>
  )
}