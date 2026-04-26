'use client'

import React from 'react'
import { Station } from '@/types/station.types'
import { getVoltageColor, getCurrentColor, getTempColor, getStatusColor, evaluateSystemStatus } from '@/utils/safetyHelpers'

export function StationStatusExtension({ station }: { station: Station }) {
  const systemStatus = evaluateSystemStatus(station)

  const statusBg: Record<string, string> = {
    SAFE: '#dcfce7', WARNING: '#fef9c3', CRITICAL: '#fee2e2',
  }
  const statusText: Record<string, string> = {
    SAFE: '#15803d', WARNING: '#854d0e', CRITICAL: '#991b1b',
  }

  return (
    <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
      <span style={{
        background: statusBg[systemStatus],
        color: statusText[systemStatus],
        borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500,
      }}>
        {systemStatus}
      </span>

      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
        <SensorValue label="Voltage" value={station.voltage} unit="V" color={getVoltageColor(station.voltage)} />
        <SensorValue label="Current" value={station.current} unit="A" color={getCurrentColor(station.current)} />
        <SensorValue label="Temp"    value={station.temperature} unit="°C" color={getTempColor(station.temperature)} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <StatusPill label="Charging" value={station.chargingStatus} onColor="#16a34a" offColor="#dc2626" />
        <StatusPill label="Fan"      value={station.fanStatus}      onColor="#16a34a" offColor="#6b7280" />
        <StatusPill label="Door"     value={station.doorStatus === 'OPEN' ? 'ON' : 'OFF'} onColor="#dc2626" offColor="#16a34a" customLabel={station.doorStatus} />
      </div>

      {station.activeUserId && (
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
          Active user: {station.activeUserId}
        </p>
      )}
    </div>
  )
}

function SensorValue({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div style={{ fontSize: 13 }}>
      <span style={{ color: '#6b7280' }}>{label}: </span>
      <span style={{ fontWeight: 500, color: getStatusColor(color as any) }}>{value}{unit}</span>
    </div>
  )
}

function StatusPill({ label, value, onColor, offColor, customLabel }: any) {
  const isOn = value === 'ON'
  return (
    <span style={{
      background: isOn ? onColor + '22' : offColor + '22',
      color: isOn ? onColor : offColor,
      borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 500,
    }}>
      {label}: {customLabel ?? value}
    </span>
  )
}
