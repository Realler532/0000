import React, { useState } from 'react';
import { Lock, Shield, AlertTriangle, Eye, FileText, Users, Clock } from 'lucide-react';
import { PatientDataAlert } from '../types/healthcare';

interface PatientDataSecurityPanelProps {
  alerts: PatientDataAlert[];
}

export function PatientDataSecurityPanel({ alerts }: PatientDataSecurityPanelProps) {
  const [selectedAlert, setSelectedAlert] = useState<PatientDataAlert | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredAlerts = filterRisk === 'all' 
    ? alerts 
    : alerts.filter(a => a.riskLevel === filterRisk);

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'unauthorized_access':
        return <Eye className="h-5 w-5 text-red-400" />;
      case 'data_export':
        return <FileText className="h-5 w-5 text-orange-400" />;
      case 'phi_exposure':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'audit_failure':
        return <Shield className="h-5 w-5 text-purple-400" />;
      default:
        return <Lock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'text-red-400 bg-red-900/30 border-red-700/50';
      case 'high':
        return 'text-orange-400 bg-orange-900/30 border-orange-700/50';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-700/50';
      case 'low':
        return 'text-blue-400 bg-blue-900/30 border-blue-700/50';
      default:
        return 'text-gray-400 bg-gray-900/30 border-gray-700/50';
    }
  };

  const criticalAlerts = alerts.filter(a => a.riskLevel === 'critical').length;
  const highRiskAlerts = alerts.filter(a => a.riskLevel === 'high').length;
  const totalRecordsAffected = alerts.reduce((sum, a) => sum + a.recordsAffected, 0);
  const hipaaNotifications = alerts.filter(a => a.hipaaNotificationRequired).length;

  return (
    <div className="space-y-6">
      {/* Patient Data Security Overview */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Lock className="h-6 w-6 text-blue-400 mr-2" />
            Patient Data Security Monitor
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <div className="text-red-400 text-2xl font-bold">{criticalAlerts}</div>
            <div className="text-gray-400 text-sm">Critical Alerts</div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50">
            <div className="text-orange-400 text-2xl font-bold">{highRiskAlerts}</div>
            <div className="text-gray-400 text-sm">High Risk</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
            <div className="text-blue-400 text-2xl font-bold">{totalRecordsAffected.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Records Affected</div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/50">
            <div className="text-purple-400 text-2xl font-bold">{hipaaNotifications}</div>
            <div className="text-gray-400 text-sm">HIPAA Notifications</div>
          </div>
        </div>
      </div>

      {/* Patient Data Alerts */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Users className="h-5 w-5 text-blue-400 mr-2" />
          Patient Data Security Alerts
        </h3>
        
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-400">No patient data security alerts</p>
            <p className="text-gray-500 text-sm">All patient data access is secure</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-opacity-80 ${getRiskColor(alert.riskLevel)}`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.alertType)}
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm capitalize">
                        {alert.alertType.replace('_', ' ')}
                      </div>
                      <div className="text-gray-300 text-sm mt-1">
                        {alert.recordsAffected.toLocaleString()} patient records affected
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.timestamp.toLocaleString()}
                        </span>
                        <span>Location: {alert.accessLocation}</span>
                        {alert.accessedBy && <span>By: {alert.accessedBy}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(alert.riskLevel)}`}>
                      {alert.riskLevel.toUpperCase()}
                    </span>
                    {alert.hipaaNotificationRequired && (
                      <div className="text-red-300 text-xs mt-1">📋 HIPAA Notification Required</div>
                    )}
                  </div>
                </div>
                
                {alert.dataTypes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Affected Data Types:</p>
                    <div className="flex flex-wrap gap-1">
                      {alert.dataTypes.map((dataType, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded"
                        >
                          {dataType}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                {getAlertIcon(selectedAlert.alertType)}
                <span className="ml-2">Patient Data Security Alert</span>
              </h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Alert Type:</span>
                  <div className="text-white font-medium capitalize">
                    {selectedAlert.alertType.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Risk Level:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(selectedAlert.riskLevel)}`}>
                    {selectedAlert.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Records Affected:</span>
                  <div className="text-white font-medium">{selectedAlert.recordsAffected.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Access Location:</span>
                  <div className="text-white font-medium">{selectedAlert.accessLocation}</div>
                </div>
              </div>
              
              {selectedAlert.patientId && (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                  <div className="text-red-300 font-medium">
                    🏥 Specific Patient ID: {selectedAlert.patientId}
                  </div>
                </div>
              )}
              
              {selectedAlert.hipaaNotificationRequired && (
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                  <div className="text-blue-300 font-medium">
                    📋 HIPAA Breach Notification Required
                  </div>
                  <div className="text-gray-300 text-sm mt-1">
                    Must notify patients and HHS within 60 days
                  </div>
                </div>
              )}
              
              <div>
                <span className="text-gray-400 text-sm">Affected Data Types:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAlert.dataTypes.map((dataType, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm"
                    >
                      {dataType}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    console.log('Initiating HIPAA breach protocol for alert:', selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Initiate Breach Protocol
                </button>
                <button
                  onClick={() => {
                    console.log('Securing patient data for alert:', selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Secure Data Access
                </button>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}