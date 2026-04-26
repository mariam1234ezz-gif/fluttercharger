'use client'

import { useSafetyMonitor } from '@/hooks/useSafetyMonitor'
import { THRESHOLDS } from '@/services/safetyService'
import {
  Zap,
  Droplet,
  Thermometer,
  AlertTriangle,
  Power,
  Wind,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react'

/**
 * SafetyPanel Component
 * Displays real-time sensor monitoring and safety status
 */
export function SafetyPanel({ stationId, showEventsTable = false }) {
  const { sensorData, safetyStatus, chargingOn, fanState, loading, error } = useSafetyMonitor(stationId)

  // Color/status helpers
  const getSafetyBadgeStyles = () => {
    switch (safetyStatus) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          border: 'border-red-500/50',
          animation: 'animate-pulse',
          icon: <XCircle className="w-6 h-6" />
        }
      case 'WARNING':
        return {
          bg: 'bg-amber-500/20',
          text: 'text-amber-400',
          border: 'border-amber-500/50',
          animation: '',
          icon: <AlertCircle className="w-6 h-6" />
        }
      default:
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-400',
          border: 'border-emerald-500/50',
          animation: '',
          icon: <CheckCircle2 className="w-6 h-6" />
        }
    }
  }

  const getMetricStatus = (value, warningThreshold, criticalThreshold) => {
    if (value >= criticalThreshold) {
      return { status: 'critical', bg: 'bg-red-500/20', text: 'text-red-400' }
    } else if (value >= warningThreshold) {
      return { status: 'warning', bg: 'bg-amber-500/20', text: 'text-amber-400' }
    }
    return { status: 'safe', bg: 'bg-emerald-500/20', text: 'text-emerald-400' }
  }

  const safetyStyles = getSafetyBadgeStyles()

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3 animate-pulse"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-700/50 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 border border-red-700 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <p>Error loading safety data: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!sensorData) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 text-gray-400">
          <AlertCircle className="w-5 h-5" />
          <p>No sensor data available</p>
        </div>
      </div>
    )
  }

  const voltageStatus = getMetricStatus(sensorData.voltage, 200, THRESHOLDS.MAX_VOLTAGE)
  const currentStatus = getMetricStatus(sensorData.current, 25, THRESHOLDS.MAX_CURRENT)
  const tempStatus = getMetricStatus(sensorData.temperature, THRESHOLDS.FAN_HIGH_TEMP, THRESHOLDS.MAX_TEMP)

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      {/* Header with Status Badge */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200">Safety Monitor</h3>
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${safetyStyles.bg} ${safetyStyles.text} ${safetyStyles.animation}
          border ${safetyStyles.border}
        `}>
          {safetyStyles.icon}
          <span className="font-semibold text-sm">{safetyStatus}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Sensor Readings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Voltage Card */}
          <div className={`
            rounded-lg p-4 border transition-all
            ${voltageStatus.bg} ${voltageStatus.text}
            border-gray-700
          `}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Voltage</span>
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold">{sensorData.voltage.toFixed(1)}V</div>
            <div className="text-xs text-gray-500 mt-1">
              Max: {THRESHOLDS.MAX_VOLTAGE}V
            </div>
          </div>

          {/* Current Card */}
          <div className={`
            rounded-lg p-4 border transition-all
            ${currentStatus.bg} ${currentStatus.text}
            border-gray-700
          `}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Current</span>
              <Droplet className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold">{sensorData.current.toFixed(1)}A</div>
            <div className="text-xs text-gray-500 mt-1">
              Max: {THRESHOLDS.MAX_CURRENT}A
            </div>
          </div>

          {/* Temperature Card */}
          <div className={`
            rounded-lg p-4 border transition-all
            ${tempStatus.bg} ${tempStatus.text}
            border-gray-700
          `}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Temperature</span>
              <Thermometer className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold">{sensorData.temperature.toFixed(1)}°C</div>
            <div className="text-xs text-gray-500 mt-1">
              Max: {THRESHOLDS.MAX_TEMP}°C
            </div>
          </div>
        </div>

        {/* Control State Indicators */}
        <div className="grid grid-cols-2 gap-4">
          {/* Charging Status */}
          <div className={`
            rounded-lg p-4 flex items-center justify-between
            border
            ${chargingOn
              ? 'bg-emerald-500/20 border-emerald-500/50'
              : 'bg-red-500/20 border-red-500/50'
            }
          `}>
            <div className="flex items-center gap-2">
              <Power className={`w-5 h-5 ${chargingOn ? 'text-emerald-400' : 'text-red-400'}`} />
              <span className="text-sm font-medium text-gray-300">Charging</span>
            </div>
            <span className={`
              text-xs font-bold px-3 py-1 rounded-full
              ${chargingOn
                ? 'bg-emerald-500/30 text-emerald-400'
                : 'bg-red-500/30 text-red-400'
              }
            `}>
              {chargingOn ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Fan Status */}
          <div className={`
            rounded-lg p-4 flex items-center justify-between
            border
            ${fanState === 'HIGH'
              ? 'bg-amber-500/20 border-amber-500/50'
              : fanState === 'ON'
              ? 'bg-emerald-500/20 border-emerald-500/50'
              : 'bg-gray-600/20 border-gray-600/50'
            }
          `}>
            <div className="flex items-center gap-2">
              <Wind className={`w-5 h-5 ${
                fanState === 'HIGH' ? 'text-amber-400' :
                fanState === 'ON' ? 'text-emerald-400' :
                'text-gray-500'
              }`} />
              <span className="text-sm font-medium text-gray-300">Fan</span>
            </div>
            <span className={`
              text-xs font-bold px-3 py-1 rounded-full
              ${fanState === 'HIGH'
                ? 'bg-amber-500/30 text-amber-400'
                : fanState === 'ON'
                ? 'bg-emerald-500/30 text-emerald-400'
                : 'bg-gray-600/30 text-gray-500'
              }
            `}>
              {fanState}
            </span>
          </div>
        </div>

        {/* Threshold Reference */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Safety Thresholds</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Fan On At</p>
              <p className="text-emerald-400 font-medium">{THRESHOLDS.FAN_ON_TEMP}°C</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fan High At</p>
              <p className="text-amber-400 font-medium">{THRESHOLDS.FAN_HIGH_TEMP}°C</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Critical Temp</p>
              <p className="text-red-400 font-medium">{THRESHOLDS.MAX_TEMP}°C</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Critical Current</p>
              <p className="text-red-400 font-medium">{THRESHOLDS.MAX_CURRENT}A</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SafetyPanel