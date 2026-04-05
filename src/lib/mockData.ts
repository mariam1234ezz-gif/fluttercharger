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
export const mockAlerts = []

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
    status: 'charging',
    battery: 'LFP 100kWh',
    soc: 67,
    power: 47.5,
    voltage: 380,
    current: 125,
    temp: 35,
  },
  {
    id: 2,
    status: 'charging',
    battery: 'LFP 80kWh',
    soc: 42,
    power: 35.6,
    voltage: 375,
    current: 95,
    temp: 32,
  },
  {
    id: 3,
    status: 'available',
  },
  {
    id: 4,
    status: 'faulty',
  },
]