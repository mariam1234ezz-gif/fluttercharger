'use client'

import { ReactNode } from 'react'

export function DataWidget({
  label,
  value,
  unit,
  status = 'normal',
  size = 'md',
}: {
  label: string
  value: string | number
  unit: string
  status?: 'normal' | 'warning' | 'critical'
  size?: 'sm' | 'md' | 'lg'
}) {
  const statusColors = {
    normal: 'text-primary',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
  }

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  }

  const valueClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <div className={`card-dark ${sizeClasses[size]} text-center`}>
      <p className="text-xs sm:text-sm text-gray-400 font-medium mb-2">{label}</p>
      <p className={`font-bold ${valueClasses[size]} ${statusColors[status]}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{unit}</p>
    </div>
  )
}

export function MetricRow({
  metrics,
}: {
  metrics: Array<{
    label: string
    value: string | number
    unit: string
    status?: 'normal' | 'warning' | 'critical'
  }>
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {metrics.map((metric, idx) => (
        <DataWidget
          key={idx}
          label={metric.label}
          value={metric.value}
          unit={metric.unit}
          status={metric.status}
          size="sm"
        />
      ))}
    </div>
  )
}

export function GaugeChart({
  value,
  max = 100,
  label,
  color = 'primary',
}: {
  value: number
  max?: number
  label: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  const percentage = (value / max) * 100

  const colorMap = {
    primary: { bg: 'conic-gradient(#00d4ff, #00d4ff)', text: 'text-primary' },
    success: { bg: 'conic-gradient(#10b981, #10b981)', text: 'text-green-400' },
    warning: { bg: 'conic-gradient(#f59e0b, #f59e0b)', text: 'text-yellow-400' },
    danger: { bg: 'conic-gradient(#ef4444, #ef4444)', text: 'text-red-400' },
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-dark-border"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            className="transition-all duration-500"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {color === 'primary' && (
                <>
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0099cc" />
                </>
              )}
              {color === 'success' && (
                <>
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </>
              )}
              {color === 'warning' && (
                <>
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </>
              )}
              {color === 'danger' && (
                <>
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-2xl font-bold ${colorMap[color].text}`}>{percentage.toFixed(0)}%</p>
            <p className="text-xs text-gray-400">{value.toFixed(1)}</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">{label}</p>
    </div>
  )
}

export function ValueTable({
  rows,
}: {
  rows: Array<{ label: string; value: string | number; color?: string }>
}) {
  return (
    <div className="space-y-2">
      {rows.map((row, idx) => (
        <div key={idx} className="flex justify-between items-center py-2 border-b border-dark-border/50">
          <span className="text-sm text-gray-400">{row.label}</span>
          <span className={`font-semibold ${row.color || 'text-primary'}`}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}
