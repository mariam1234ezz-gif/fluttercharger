'use client'

import { useAlerts } from '@/hooks/useAlerts'
import { ALERT_TYPES, ALERT_SEVERITY } from '@/services/alertService'
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  MapPin,
  User
} from 'lucide-react'

/**
 * AlertsPanel Component
 * Displays real-time alerts from Firestore with severity badges
 */
export function AlertsPanel({ maxAlerts = 50, showHeader = true }) {
  const { alerts, loading, error } = useAlerts(maxAlerts)

  // Debug: Log what the panel receives
  console.log('[AlertsPanel] alerts:', alerts, 'loading:', loading, 'error:', error);

  // Get severity badge styles
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case ALERT_SEVERITY.CRITICAL:
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          border: 'border-red-500/30',
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'CRITICAL'
        }
      case ALERT_SEVERITY.WARNING:
        return {
          bg: 'bg-amber-500/20',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'WARNING'
        }
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'INFO'
        }
    }
  }

  // Get status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          label: 'ACTIVE'
        }
      case 'resolved':
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-400',
          label: 'RESOLVED'
        }
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          label: status?.toUpperCase() || 'UNKNOWN'
        }
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-'
    
    const date = timestamp instanceof Date
      ? timestamp
      : new Date(timestamp)
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  // Get alert type label
  const getTypeLabel = (type) => {
    switch (type) {
      case ALERT_TYPES.DOOR_VIOLATION:
        return 'Door Violation'
      case ALERT_TYPES.DOOR_WARNING:
        return 'Door Warning'
      default:
        return type || 'Alert'
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        {showHeader && (
          <div className="p-4 border-b border-gray-700">
            <div className="h-5 bg-gray-700 rounded w-1/4 animate-pulse"></div>
          </div>
        )}
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-700/50 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 border border-red-700 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <p>Error loading alerts: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      {showHeader && (
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-200">Alerts</h3>
          <span className="text-sm text-gray-500">
            {alerts.filter(a => a.status === 'active').length} active
          </span>
        </div>
      )}

      {/* Alerts List */}
      <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-gray-400">No alerts recorded</p>
            <p className="text-sm text-gray-500 mt-1">All systems operating normally</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const severityBadge = getSeverityBadge(alert.severity)
            const statusBadge = getStatusBadge(alert.status)
            
            return (
              <div
                key={alert.id}
                className="p-4 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Severity Icon */}
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                    ${severityBadge.bg} ${severityBadge.text}
                  `}>
                    {severityBadge.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Type Label */}
                      <span className="text-sm font-medium text-gray-300">
                        {getTypeLabel(alert.type)}
                      </span>
                      {/* Severity Badge */}
                      <span className={`
                        inline-flex px-2 py-0.5 text-xs font-medium rounded
                        ${severityBadge.bg} ${severityBadge.text}
                      `}>
                        {severityBadge.label}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-400 mb-2">
                      {alert.message}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {/* Station */}
                      {alert.stationId && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.stationId}
                        </span>
                      )}
                      {/* User */}
                      {alert.userId && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {alert.userId}
                        </span>
                      )}
                      {/* Timestamp */}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`
                    flex-shrink-0 px-2 py-1 text-xs font-medium rounded
                    ${statusBadge.bg} ${statusBadge.text}
                  `}>
                    {statusBadge.label}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/30">
          <p className="text-xs text-gray-500">
            Showing {alerts.length} most recent alerts
          </p>
        </div>
      )}
    </div>
  )
}

export default AlertsPanel