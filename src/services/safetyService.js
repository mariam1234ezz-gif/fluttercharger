import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore'
import { createAlert } from './alertService'

// ============================================
// Threshold Constants
// ============================================
export const THRESHOLDS = {
  MAX_VOLTAGE: 240,       // Volts — above this = over voltage
  MAX_CURRENT: 32,        // Amps  — above this = over current
  MAX_TEMP: 50,           // °C    — above this = over temperature + stop charging
  FAN_ON_TEMP: 30,        // °C    — fan turns on at this temp
  FAN_HIGH_TEMP: 40,      // °C    — fan high priority + alert above this
}

// ============================================
// STEP 1: evaluateSafety() — Pure Function
// ============================================
/**
 * Evaluates sensor readings against safety thresholds
 * Pure function — no async, no side effects
 * @param {number} voltage - Voltage in volts
 * @param {number} current - Current in amps
 * @param {number} temp - Temperature in celsius
 * @returns {Object} Safety assessment with violations, status, and control recommendations
 */
export function evaluateSafety(voltage, current, temp) {
  const violations = []

  // Check each threshold
  if (voltage > THRESHOLDS.MAX_VOLTAGE) violations.push('OVER_VOLTAGE')
  if (current > THRESHOLDS.MAX_CURRENT) violations.push('OVER_CURRENT')
  if (temp > THRESHOLDS.MAX_TEMP) violations.push('OVER_TEMPERATURE')

  // Determine severity
  const isCritical = violations.length > 0
  const isWarning = !isCritical && temp >= THRESHOLDS.FAN_HIGH_TEMP

  // Determine fan state based on temperature
  let fanState = 'OFF'
  if (temp >= THRESHOLDS.FAN_ON_TEMP) {
    fanState = temp >= THRESHOLDS.FAN_HIGH_TEMP ? 'HIGH' : 'ON'
  }

  return {
    violations,                               // string[]
    isCritical,                               // boolean — stop charging immediately
    isWarning,                                // boolean — fan high, no charge stop
    safetyStatus: isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'SAFE',
    shouldStopCharging: isCritical,
    fanState,                                 // "OFF" | "ON" | "HIGH"
  }
}

// ============================================
// STEP 2: controlCharging() — Enable/Disable Charging
// ============================================
/**
 * Controls charging state by updating Firestore
 * ESP/Arduino polls this field and physically opens/closes relay
 * @param {string} stationId - Station identifier
 * @param {boolean} enable - Enable (true) or disable (false) charging
 */
export async function controlCharging(stationId, enable) {
  console.log('[SafetyService] Charging set to:', enable ? 'ON' : 'OFF', 'for station:', stationId)

  await updateDoc(doc(db, 'stations', stationId), {
    chargingEnabled: enable,
    lastUpdated: serverTimestamp(),
  })
}

// ============================================
// STEP 3: controlFan() — Control Fan Speed
// ============================================
/**
 * Controls fan state by updating Firestore
 * ESP/Arduino reads this and controls fan via PWM
 * @param {string} stationId - Station identifier
 * @param {string} fanState - "OFF" | "ON" | "HIGH"
 */
export async function controlFan(stationId, fanState) {
  console.log('[SafetyService] Fan set to:', fanState, 'for station:', stationId)

  await updateDoc(doc(db, 'stations', stationId), {
    fanState,
    lastUpdated: serverTimestamp(),
  })
}

// ============================================
// STEP 4: buildAlertMessage() — Helper
// ============================================
/**
 * Builds human-readable alert message from violation type and sensor readings
 * @param {string} type - Violation type
 * @param {Object} reading - Sensor readings {voltage, current, temperature}
 * @returns {string} Alert message
 */
function buildAlertMessage(type, { voltage, current, temperature }) {
  const map = {
    OVER_VOLTAGE: `Over voltage detected: ${voltage.toFixed(1)}V (max ${THRESHOLDS.MAX_VOLTAGE}V)`,
    OVER_CURRENT: `Over current detected: ${current.toFixed(1)}A (max ${THRESHOLDS.MAX_CURRENT}A)`,
    OVER_TEMPERATURE: `Over temperature detected: ${temperature.toFixed(1)}°C (max ${THRESHOLDS.MAX_TEMP}°C)`,
  }
  return map[type] ?? 'Unknown safety event'
}

// ============================================
// STEP 5: handleSafetyEvent() — Main Orchestrator
// ============================================
/**
 * Orchestrates the full safety response to a sensor reading
 * Called every time a new sensor reading arrives
 * @param {string} stationId - Station identifier
 * @param {Object} reading - Sensor reading {voltage, current, temperature}
 * @returns {Promise<Object>} Safety assessment
 */
export async function handleSafetyEvent(stationId, reading) {
  console.log('[SafetyService] handleSafetyEvent called for station:', stationId, 'reading:', reading)

  const { voltage, current, temperature } = reading
  const assessment = evaluateSafety(voltage, current, temperature)

  try {
    // 1. Control charging relay FIRST (most critical)
    await controlCharging(stationId, !assessment.shouldStopCharging)

    // 2. Control fan AFTER charging
    await controlFan(stationId, assessment.fanState)

    // 3. Update station safety status
    await updateDoc(doc(db, 'stations', stationId), {
      safetyStatus: assessment.safetyStatus,
      lastUpdated: serverTimestamp(),
    })

    // 4. Create alerts for each violation (dedup handled inside createAlert)
    for (const violation of assessment.violations) {
      // Use 1-minute bucket for dedup: fires at most once per minute per violation type
      const minuteBucket = Math.floor(Date.now() / 60000)
      const relatedEventId = `${stationId}_${violation}_${minuteBucket}`

      console.log('[SafetyService] Creating alert for:', violation, 'relatedEventId:', relatedEventId)

      await createAlert({
        type: violation, // "OVER_VOLTAGE" | "OVER_CURRENT" | "OVER_TEMPERATURE"
        severity: 'critical',
        stationId,
        message: buildAlertMessage(violation, reading),
        relatedEventId,
        sensorValues: { voltage, current, temperature },
      })
    }

    // 5. Write to /safetyEvents for history log
    await addDoc(collection(db, 'safetyEvents'), {
      stationId,
      violations: assessment.violations,
      isCritical: assessment.isCritical,
      isWarning: assessment.isWarning,
      safetyStatus: assessment.safetyStatus,
      shouldStopCharging: assessment.shouldStopCharging,
      fanState: assessment.fanState,
      voltage,
      current,
      temperature,
      timestamp: serverTimestamp(),
      status: assessment.isCritical ? 'active' : 'resolved',
    })

    console.log('[SafetyService] Safety event handled. Assessment:', assessment)
  } catch (error) {
    console.error('[SafetyService] Error handling safety event:', error)
    throw error
  }

  return assessment
}

// ============================================
// Additional Utilities
// ============================================

/**
 * Gets the latest safety event for a station
 * @param {string} stationId - Station identifier
 * @returns {Promise<Object|null>}
 */
export async function getLatestSafetyEvent(stationId) {
  const safetyEventsRef = collection(db, 'safetyEvents')
  const q = query(
    safetyEventsRef,
    where('stationId', '==', stationId),
    orderBy('timestamp', 'desc'),
    limit(1)
  )

  const snapshot = await getDocs(q)
  if (snapshot.empty) return null

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  }
}

/**
 * Emergency stop: disable charging and set fan to HIGH
 * @param {string} stationId - Station identifier
 */
export async function emergencyStop(stationId) {
  console.log('[SafetyService] EMERGENCY STOP triggered for station:', stationId)

  await Promise.all([
    controlCharging(stationId, false),
    controlFan(stationId, 'HIGH'),
    updateDoc(doc(db, 'stations', stationId), {
      safetyStatus: 'CRITICAL',
      lastUpdated: serverTimestamp(),
    }),
  ])

  // Log emergency event
  await addDoc(collection(db, 'safetyEvents'), {
    stationId,
    violations: ['EMERGENCY_STOP'],
    isCritical: true,
    safetyStatus: 'CRITICAL',
    timestamp: serverTimestamp(),
    status: 'active',
  })
}

/**
 * Reset to safe state: enable charging and turn off fan
 * @param {string} stationId - Station identifier
 */
export async function resetToSafe(stationId) {
  console.log('[SafetyService] Reset to SAFE state for station:', stationId)

  await Promise.all([
    controlCharging(stationId, true),
    controlFan(stationId, 'OFF'),
    updateDoc(doc(db, 'stations', stationId), {
      safetyStatus: 'SAFE',
      lastUpdated: serverTimestamp(),
    }),
  ])

  // Log reset event
  await addDoc(collection(db, 'safetyEvents'), {
    stationId,
    violations: [],
    isCritical: false,
    safetyStatus: 'SAFE',
    timestamp: serverTimestamp(),
    status: 'resolved',
  })
}