'use client'

import { Card } from '@/components/Cards'
import { User, Activity, DollarSign } from 'lucide-react'

export default function Profile() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header with Avatar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Owner Profile</h1>
              <p className="text-gray-400 mt-2">Manage your station information and overview</p>
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg">
              <User size={32} className="text-white" />
            </div>
          </div>

          {/* Personal Info Card */}
          <Card className="bg-dark-card border border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User size={20} className="text-primary" />
              </div>
              <h2 className="font-semibold text-lg text-white">Personal Info</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">Mariam Ahmed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium">mariam@email.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Role:</span>
                <span className="text-white font-medium">Station Owner</span>
              </div>
            </div>
          </Card>

          {/* System Overview Card */}
          <Card className="bg-dark-card border border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity size={20} className="text-primary" />
              </div>
              <h2 className="font-semibold text-lg text-white">System Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Chargers</p>
                <p className="text-3xl font-bold text-primary">6</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Active Slots</p>
                <p className="text-3xl font-bold text-green-400">3</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Energy Today</p>
                <p className="text-3xl font-bold text-blue-400">120 <span className="text-lg">kWh</span></p>
              </div>
            </div>
          </Card>

          {/* Business Info Card */}
          <Card className="bg-dark-card border border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign size={20} className="text-primary" />
              </div>
              <h2 className="font-semibold text-lg text-white">Business Info</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Station:</span>
                <span className="text-white font-medium">Smart EV Station</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Revenue Today:</span>
                <span className="text-2xl font-bold text-green-400">850 <span className="text-lg">EGP</span></span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}