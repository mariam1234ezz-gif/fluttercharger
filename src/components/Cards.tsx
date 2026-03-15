'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-dark p-4 ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  unit = '',
  color = 'primary',
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ size: number; className?: string }>
  trend?: { value: number; positive: boolean }
  unit?: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}) {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    info: 'text-blue-400',
  }

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {unit && <p className="text-xs text-gray-500 mt-1">{unit}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-dark-bg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-xs">
          {trend.positive ? (
            <>
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-green-400">+{trend.value}%</span>
            </>
          ) : (
            <>
              <TrendingDown size={14} className="text-red-400" />
              <span className="text-red-400">{trend.value}%</span>
            </>
          )}
          <span className="text-gray-500">vs yesterday</span>
        </div>
      )}
    </Card>
  )
}

export function AlertCard({ title, icon: Icon, message, severity }: any) {
  const severityColors = {
    critical: 'bg-red-500/10 border-red-500/20 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  }

  return (
    <Card className={`border ${severityColors[severity]}`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className="flex-shrink-0 mt-1" />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-gray-300 mt-1">{message}</p>
        </div>
      </div>
    </Card>
  )
}

export function ProgressBar({
  value,
  max = 100,
  label,
  color = 'primary',
  showValue = true,
}: {
  value: number
  max?: number
  label?: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showValue?: boolean
}) {
  const percentage = (value / max) * 100
  const colorMap = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  }

  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between text-xs">
          {label && <span className="text-gray-400">{label}</span>}
          {showValue && <span className="text-gray-400">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function Badge({
  children,
  variant = 'info',
}: {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info'
}) {
  const variants = {
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  }

  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  [key: string]: any
}) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center gap-2 justify-center'

  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/50',
    secondary: 'bg-dark-border text-gray-200 hover:bg-dark-border/80',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
