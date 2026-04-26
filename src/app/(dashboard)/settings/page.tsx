'use client'

import { useState } from 'react'

export default function Settings() {
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="bg-dark-card p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span>Enable Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </div>
    </div>
  )
}