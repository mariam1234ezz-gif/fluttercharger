'use client'

import { Bell, Settings, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Header({ title, description }: { title: string; description?: string }) {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [openSettings, setOpenSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const router = useRouter()

  // ⏱️ Clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // 🔔 Fake Notifications
  const notifications = [
    { id: 1, text: 'Charger 2 stopped', time: '2 min ago' },
    { id: 2, text: 'High temperature alert', time: '5 min ago' },
    { id: 3, text: 'Charging completed', time: '10 min ago' },
  ]

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <header className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">

        {/* 🔹 Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
        </div>

        {/* 🔹 Right Side */}
        <div className="flex items-center gap-4">

          {/* ⏱️ Clock */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 bg-dark-bg/50 px-3 py-2 rounded-lg">
            <span>🕐</span>
            <span>{currentTime}</span>
          </div>

          {/* 🔔 Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setOpenSettings(false)
              }}
              className="relative p-2 hover:bg-dark-border rounded-lg transition-colors"
            >
              <Bell size={20} className="text-gray-400 hover:text-primary" />

              {/* 🔴 Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* 🔽 Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-dark-card border border-dark-border rounded-lg shadow-lg z-50 p-4">

                <h3 className="text-white font-semibold mb-3">Notifications</h3>

                {notifications.map((n) => (
                  <div key={n.id} className="mb-3 border-b border-dark-border pb-2">
                    <p className="text-sm text-white">{n.text}</p>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <p className="text-gray-400 text-sm">No notifications</p>
                )}
              </div>
            )}
          </div>

          {/* ⚙️ Settings */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpenSettings(prev => !prev)
                setShowNotifications(false)
              }}
              className="p-2 hover:bg-dark-border rounded-lg transition-colors"
            >
              <Settings size={20} className="text-gray-400 hover:text-primary" />
            </button>

            {openSettings && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg z-50"
              >
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full text-left px-4 py-2 hover:bg-dark-border text-gray-300"
                >
                  Profile
                </button>

                <button
                  onClick={() => router.push('/settings')}
                  className="w-full text-left px-4 py-2 hover:bg-dark-border text-gray-300"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-dark-border text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* 👤 User */}
          <button
            onClick={() => router.push('/profile')}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          >
            <User size={20} className="text-gray-400 hover:text-primary" />
          </button>

        </div>
      </div>
    </header>
  )
}