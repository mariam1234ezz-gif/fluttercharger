export interface Station {
  stationId: string
  voltage: number
  current: number
  temperature: number
  fanStatus: 'ON' | 'OFF' | 'HIGH'
  chargingStatus: 'ON' | 'OFF'
  doorStatus: 'OPEN' | 'CLOSED'
  activeUserId: string | null
}

export interface Alert {
  id: string
  type: string
  severity: 'info' | 'warning' | 'critical'
  stationId: string
  message: string
  timestamp: any
  status: 'active' | 'resolved'
}

export type SystemStatus = 'SAFE' | 'WARNING' | 'CRITICAL'
export type StatusColor = 'green' | 'yellow' | 'red' | 'gray'
