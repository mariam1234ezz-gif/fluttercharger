'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Monitoring', href: '/monitoring' },
  { name: 'Energy', href: '/energy' },
  { name: 'Batteries', href: '/batteries' },
  { name: 'Alerts', href: '/alerts' },
  { name: 'Reports', href: '/reports' },
  { name: 'Slots', href: '/slots' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen bg-slate-950 text-white p-4">
      <h2 className="text-lg font-bold mb-6">Owner Dashboard</h2>

      <div className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}