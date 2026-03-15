'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Zap, Sun, AlertCircle, Grid3x3, Battery, BarChart3, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/monitoring', label: 'Monitoring', icon: Zap },
  { href: '/energy', label: 'Energy', icon: Sun },
  { href: '/alerts', label: 'Alerts', icon: AlertCircle },
  { href: '/slots', label: 'Slots', icon: Grid3x3 },
  { href: '/batteries', label: 'Batteries', icon: Battery },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-dark-card border border-dark-border rounded-lg p-2 hover:border-primary transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed left-0 top-0 h-screen w-64 bg-dark-card border-r border-dark-border p-6 overflow-y-auto transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <div className="text-xl font-bold text-primary">EV Station</div>
        </div>

        {/* Navigation Items */}
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-border/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-dark-border">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Admin Dashboard v1.0</p>
            <p className="text-primary">Status: Online</p>
          </div>
        </div>
      </nav>

      {/* Main content offset */}
      <div className="md:ml-64" />
    </>
  )
}
