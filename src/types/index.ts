export interface ChargerSlot {
  id: string
  slotNumber: number
  status: 'available' | 'charging' | 'faulty'
  batteryType: string
  batterySOC: number
  voltage: number
  current: number
  power: number
  temperature: number
  chargingMode: 'fast' | 'normal'
  startTime?: string
  estimatedEndTime?: string
}

export interface ChargingSession {
  id: string
  slotId: string
  batteryId: string
  startTime: string
  endTime?: string
  energyConsumed: number
  status: 'active' | 'completed' | 'failed'
}

export interface Battery {
  id: string
  serialNumber: string
  type: string
  capacity: number
  soc: number
  health: number
  status: 'charged' | 'empty' | 'faulty' | 'in-use'
  lastUsedSlot?: string
}

export interface Alert {
  id: string
  type: 'overvoltage' | 'overcurrent' | 'overheating' | 'short-circuit' | 'system-failure' | 'communication-loss'
  severity: 'critical' | 'warning' | 'info'
  slotId?: string
  message: string
  timestamp: string
  resolved: boolean
}

export interface EnergyData {
  timestamp: string
  solarInput: number
  gridInput: number
  totalInput: number
  totalOutput: number
  efficiency: number
}

export interface DashboardStats {
  totalSlots: number
  availableSlots: number
  occupiedSlots: number
  faultySlots: number
  chargedBatteries: number
  emptyBatteries: number
  activeChargingSessions: number
  totalEnergyConsumed: number
  solarContribution: number
  gridContribution: number
  dailyRevenue: number
  systemEfficiency: number
}

export interface ReportData {
  date: string
  chargingSessions: number
  energyConsumed: number
  solarGenerated: number
  revenue: number
}
