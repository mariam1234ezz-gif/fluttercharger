'use client'

import { Bell, Settings, User, AlertTriangle, AlertCircle, CheckCircle, Zap } from 'lucide-react'
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

  // 🔔 Enhanced Notifications with severity levels
  const notifications = [
    {
      id: 1,
      text: 'Charger 2 stopped responding',
      time: '2 min ago',
      severity: 'critical',
      type: 'error',
      isNew: true
    },
    {
      id: 2,
      text: 'High temperature alert on Slot 5',
      time: '5 min ago',
      severity: 'warning',
      type: 'warning',
      isNew: false
    },
    {
      id: 3,
      text: 'Charging session completed successfully',
      time: '10 min ago',
      severity: 'info',
      type: 'success',
      isNew: false
    },
    {
      id: 4,
      text: 'System maintenance scheduled',
      time: '1 hour ago',
      severity: 'info',
      type: 'info',
      isNew: false
    }
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

            {/* 🔽 Enhanced Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 overflow-hidden">

                {/* Header with Live Badge */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border bg-dark-bg/30">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400 font-medium">Live</span>
                    </div>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n, index) => {
                    const getSeverityStyles = (severity: string) => {
                      switch (severity) {
                        case 'critical':
                          return {
                            borderColor: 'border-red-500/30',
                            bgColor: 'bg-red-500/5',
                            textColor: 'text-red-400',
                            iconColor: 'text-red-400'
                          }
                        case 'warning':
                          return {
                            borderColor: 'border-yellow-500/30',
                            bgColor: 'bg-yellow-500/5',
                            textColor: 'text-yellow-400',
                            iconColor: 'text-yellow-400'
                          }
                        case 'info':
                          return {
                            borderColor: 'border-green-500/30',
                            bgColor: 'bg-green-500/5',
                            textColor: 'text-green-400',
                            iconColor: 'text-green-400'
                          }
                        default:
                          return {
                            borderColor: 'border-gray-500/30',
                            bgColor: 'bg-gray-500/5',
                            textColor: 'text-gray-400',
                            iconColor: 'text-gray-400'
                          }
                      }
                    }

                    const getIcon = (type: string) => {
                      switch (type) {
                        case 'error':
                          return <AlertTriangle size={16} />
                        case 'warning':
                          return <AlertCircle size={16} />
                        case 'success':
                          return <CheckCircle size={16} />
                        default:
                          return <Bell size={16} />
                      }
                    }

                    const styles = getSeverityStyles(n.severity)
                    const isNewest = index === 0

                    return (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-l-4 ${styles.borderColor} ${styles.bgColor} ${
                          isNewest ? 'bg-primary/5 border-l-primary' : ''
                        } hover:bg-dark-bg/50 transition-colors cursor-pointer`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Severity Indicator Dot */}
                          <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                            n.severity === 'critical' ? 'bg-red-500' :
                            n.severity === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>

                          {/* Icon */}
                          <div className={`${styles.iconColor} flex-shrink-0 mt-0.5`}>
                            {getIcon(n.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${styles.textColor} font-medium leading-tight`}>
                              {n.text}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">{n.time}</span>
                              {n.isNew && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {notifications.length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <Bell size={24} className="text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No notifications</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-dark-border bg-dark-bg/20">
                  <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors">
                    View All Notifications
                  </button>
                </div>
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