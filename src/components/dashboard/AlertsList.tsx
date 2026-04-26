'use client'

import React from 'react'
import { useAlerts } from '@/hooks/useAlerts'

const severityStyle: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#fee2e2', text: '#991b1b' },
  warning:  { bg: '#fef9c3', text: '#854d0e' },
  info:     { bg: '#dbeafe', text: '#1e40af' },
}

export function AlertsList() {
  const { alerts } = useAlerts()

  if (!alerts || alerts.length === 0) return (
    <p style={{ color: '#6b7280', fontSize: 14 }}>No active alerts.</p>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map(alert => {
        const s = severityStyle[alert.severity] ?? severityStyle.info
        return (
          <div key={alert.id} style={{
            background: s.bg, borderRadius: 8, padding: '10px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <span style={{ fontWeight: 500, color: s.text, fontSize: 13 }}>{alert.type}</span>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#374151' }}>{alert.message}</p>
              <span style={{ fontSize: 11, color: '#6b7280' }}>Station: {alert.stationId}</span>
            </div>
            <span style={{
              background: s.text, color: '#fff',
              borderRadius: 999, padding: '2px 8px', fontSize: 11,
            }}>
              {alert.severity}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default AlertsList
