// Door Event Types
export interface DoorEvent {
  id: string
  userId: string
  stationId: string
  openedAt: Date | null
  closedAt: Date | null
  durationSeconds: number | null
  status: 'open' | 'closed_normal' | 'violation'
  penaltyApplied: boolean
}

// Penalty Types
export interface Penalty {
  id: string
  userId: string
  stationId: string
  amount: number
  reason: string
  timestamp: Date | null
  relatedEventId: string
}

// Station Types
export interface Station {
  id: string
  name: string
  currentDoorState: 'OPEN' | 'CLOSED'
  lastOpenedBy: string | null
  lastOpenedAt: Date | null
  maintenanceMode: boolean
}

// Door Status for UI
export interface DoorStatus {
  doorState: 'OPEN' | 'CLOSED'
  lastOpenedBy: string | null
  lastOpenedAt: Date | null
  maintenanceMode: boolean
}

// Timer states for UI
export type DoorTimerState = 'safe' | 'warning' | 'violation'

// Constants
export const PENALTY_THRESHOLD_SECONDS = 420 // 7 minutes
export const PENALTY_AMOUNT = 50 // EGP
export const PENALTY_REASON = 'Door left open for more than 7 minutes'