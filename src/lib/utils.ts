export const formatNumber = (num: number) => num;

export const formatEnergy = (num: number) => `${num} kWh`;

export const formatCurrency = (num: number) => `$${num}`;

export const formatPercentage = (num: number) => `${num}%`;

export const formatVoltage = (value: number) => `${value} V`;

export const formatCurrent = (value: number) => `${value} A`;

export const formatTemperature = (temp: number) => `${temp}°C`;

export const getTemperatureStatus = (temp: number) => {
  if (temp > 50) return 'critical';
  if (temp > 35) return 'warning';
  return 'normal';
};