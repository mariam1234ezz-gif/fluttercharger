// Dashboard
export const mockDashboardStats = []

// Energy Data (🔥 المهم)
export const mockEnergyData = [
  { name: 'Mon', solar: 20, grid: 40 },
  { name: 'Tue', solar: 30, grid: 35 },
  { name: 'Wed', solar: 25, grid: 45 },
  { name: 'Thu', solar: 40, grid: 30 },
  { name: 'Fri', solar: 35, grid: 25 },
]

// Alerts
export const mockAlerts: any[] = []

// Batteries
export const mockBatteries = [
  { id: 1, status: 'charged' },
  { id: 2, status: 'empty' },
  { id: 3, status: 'faulty' },
  { id: 4, status: 'in-use' },
  { id: 5, status: 'charged' },
  { id: 6, status: 'empty' },
]

// Reports
export const mockReportData = [
  {
    chargingSessions: 20,
    energyConsumed: 150,
    revenue: 500,
    solarGenerated: 80,
  },
  {
    chargingSessions: 25,
    energyConsumed: 180,
    revenue: 620,
    solarGenerated: 95,
  },
  {
    chargingSessions: 18,
    energyConsumed: 140,
    revenue: 450,
    solarGenerated: 70,
  },
]

// Charger Slots (🔥 بدون duplication)
export const mockChargerSlots = [
  {
    id: 1,
    slotNumber: 1,
    status: 'charging',
    batteryType: 'LFP 100kWh',
    batterySOC: 67,
    power: 47.5,
    voltage: 430,
    current: 125,
    temperature: 48,
    chargingMode: 'fast',
    isOnline: true,
    doorStatus: 'closed',
  },
  {
    id: 2,
    slotNumber: 2,
    status: 'charging',
    batteryType: 'LFP 80kWh',
    batterySOC: 42,
    power: 35.6,
    voltage: 375,
    current: 155,
    temperature: 37,
    chargingMode: 'normal',
    isOnline: true,
    doorStatus: 'closed',
  },
  {
    id: 3,
    slotNumber: 3,
    status: 'available',
    batteryType: 'LFP 60kWh',
    batterySOC: 0,
    power: 0,
    voltage: 0,
    current: 0,
    temperature: 28,
    chargingMode: 'normal',
    isOnline: true,
    doorStatus: 'open',
  },
  {
    id: 4,
    slotNumber: 4,
    status: 'faulty',
    batteryType: 'Lead-Acid 75kWh',
    batterySOC: 18,
    power: 0,
    voltage: 360,
    current: 0,
    temperature: 32,
    chargingMode: 'normal',
    isOnline: false,
    doorStatus: 'closed',
  },
]