export const formatNumber = (num: number, decimals: number = 2): string => {
  return Number(num.toFixed(decimals)).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export const formatEnergy = (kWh: number): string => {
  if (kWh >= 1000) {
    return `${formatNumber(kWh / 1000, 2)} MWh`
  }
  return `${formatNumber(kWh, 1)} kWh`
}

export const formatPower = (kW: number): string => {
  if (kW >= 1000) {
    return `${formatNumber(kW / 1000, 2)} MW`
  }
  return `${formatNumber(kW, 1)} kW`
}

export const formatVoltage = (v: number): string => {
  return `${formatNumber(v, 0)} V`
}

export const formatCurrent = (a: number): string => {
  return `${formatNumber(a, 1)} A`
}

export const formatTemperature = (c: number): string => {
  return `${formatNumber(c, 1)}°C`
}

export const formatPercentage = (percent: number): string => {
  return `${formatNumber(percent, 1)}%`
}

export const formatSOC = (soc: number): string => {
  return `${formatNumber(soc, 0)}%`
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return 'text-green-400'
    case 'charging':
      return 'text-blue-400'
    case 'faulty':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

export const getStatusBgColor = (status: string): string => {
  switch (status) {
    case 'available':
      return 'bg-green-500/10 border-green-500/20'
    case 'charging':
      return 'bg-blue-500/10 border-blue-500/20'
    case 'faulty':
      return 'bg-red-500/10 border-red-500/20'
    default:
      return 'bg-gray-500/10 border-gray-500/20'
  }
}

export const getAlertSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'text-red-400'
    case 'warning':
      return 'text-yellow-400'
    case 'info':
      return 'text-blue-400'
    default:
      return 'text-gray-400'
  }
}

export const getAlertSeverityBgColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10 border-red-500/20'
    case 'warning':
      return 'bg-yellow-500/10 border-yellow-500/20'
    case 'info':
      return 'bg-blue-500/10 border-blue-500/20'
    default:
      return 'bg-gray-500/10 border-gray-500/20'
  }
}

export const calculateEfficiency = (input: number, output: number): number => {
  if (input === 0) return 0
  return (output / input) * 100
}

export const getTemperatureStatus = (temp: number): 'normal' | 'warning' | 'critical' => {
  if (temp > 45) return 'critical'
  if (temp > 40) return 'warning'
  return 'normal'
}

export const getCurrentStatus = (current: number): 'normal' | 'warning' | 'critical' => {
  if (current > 150) return 'critical'
  if (current > 120) return 'warning'
  return 'normal'
}

export const getVoltageStatus = (voltage: number): 'normal' | 'warning' | 'critical' => {
  if (voltage > 400 || voltage < 350) return 'critical'
  if (voltage > 390 || voltage < 360) return 'warning'
  return 'normal'
}
