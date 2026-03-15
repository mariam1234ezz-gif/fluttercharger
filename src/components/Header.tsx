'use client'

import { Bell, Settings, User } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ title, description }: { title: string; description?: string }) {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 bg-dark-bg/50 px-3 py-2 rounded-lg">
            <span>🕐</span>
            <span>{currentTime}</span>
          </div>

          <button className="relative p-2 hover:bg-dark-border rounded-lg transition-colors">
            <Bell size={20} className="text-gray-400 hover:text-primary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          <button className="p-2 hover:bg-dark-border rounded-lg transition-colors">
            <Settings size={20} className="text-gray-400 hover:text-primary" />
          </button>

          <button className="p-2 hover:bg-dark-border rounded-lg transition-colors">
            <User size={20} className="text-gray-400 hover:text-primary" />
          </button>
        </div>
      </div>
    </header>
  )
}
