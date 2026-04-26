import { Station, SystemStatus, StatusColor } from '@/types/station.types'

const MAX_VOLTAGE = 240
const MAX_CURRENT = 32

export function getVoltageColor(v: number): StatusColor {
  if (v > MAX_VOLTAGE) return 'red'
  if (v > MAX_VOLTAGE * 0.85) return 'yellow'
  return 'green'
}

export function getCurrentColor(a: number): StatusColor {
  if (a > MAX_CURRENT) return 'red'
  if (a > MAX_CURRENT * 0.8) return 'yellow'
  return 'green'
}

export function getTempColor(t: number): StatusColor {
  if (t > 40) return 'red'
  if (t >= 30) return 'yellow'
  return 'green'
}

export function getStatusColor(color: StatusColor): string {
  const map: Record<StatusColor, string> = {
    green: '#16a34a',
    yellow: '#ca8a04',
    red:    '#dc2626',
    gray:   '#6b7280',
  }
  return map[color]
}

export function evaluateSystemStatus(station: Station): SystemStatus {
  const isCritical =
    station.voltage > MAX_VOLTAGE ||
    station.current > MAX_CURRENT ||
    station.temperature > 40
  const isWarning = station.temperature >= 30
  if (isCritical) return 'CRITICAL'
  if (isWarning) return 'WARNING'
  return 'SAFE'
}
