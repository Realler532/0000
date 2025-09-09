import React, { useState, useEffect } from 'react';
import { Bell, Heart, Shield, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface HospitalAlert {
  id: string;
  type: 'patient_safety' | 'data_security' | 'device_malfunction' | 'compliance' | 'network_security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  patientImpact: boolean;
  hipaaRelevant: boolean;
  requiresImmedateAction: boolean;
}

export function HospitalAlertPanel() {
  const [alerts, setAlerts] = useState<HospitalAlert[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<HospitalAlert | null>(null);

  useEffect(() => {
    // Initialize with sample alerts
    const initialAlerts: HospitalAlert[] = [
      {
        id: '1',
        type: 'patient_safety',
        severity: 'critical',
        title: 'Ventilator Network Compromise',
        message: 'Unauthorized access detected on life support systems in ICU',
        source: 'Medical Device Monitor',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        acknowledged: false,
        patientImpact: true,
        hipaaRelevant: false,
        requiresImmedateAction: true
      },
      {
        id: '2',
        type: 'data_security',
        severity: 'high',
        title: 'Patient Records Unauthorized Access',
        message: 'Multiple patient records accessed from external IP address',
        source: 'EHR Security Monitor',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        acknowledged: false,
        patientImpact: false,
        hipaaRelevant: true,
        requiresImmedateAction: true
      },
      {
        id: '3',
        type: 'device_malfunction',
        severity: 'medium',
        title: 'MRI Scanner Network Anomaly',
        message: 'Unusual network traffic detected from MRI control system',
        source: 'Network Security Monitor',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        acknowledged: true,
        patientImpact: false,
        hipaaRelevant: false,
        requiresImmedateAction: false
      }
    ];

    setAlerts(initialAlerts);

    // Simulate new alerts
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: HospitalAlert = {
          id: Date.now().toString(),
          type: ['patient_safety', 'data_security', 'device_malfunction', 'compliance', 'network_security'][Math.floor(Math.random() * 5)] as any,
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          title: 'New Security Alert Detected',
          message: 'Automated threat detection system has identified a potential security issue',
          source: 'ML Threat Detector',
          timestamp: new Date(),
          acknowledged: false,
          patientImpact: Math.random() > 0.7,
          hipaaRelevant: Math.random() > 0.6,
          requiresImmedateAction: Math.random() > 0.8
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
      }
    }, 15000);

    return () => clearInterval(alertInterval);
  }, []);

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filterType);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'patient_safety':
        return <Heart className="h-5 w-5 text-red-400" />;
      case 'data_security':
        return <Shield className="h-5 w-5 text-blue-400" />;
      case 'device_malfunction':
        return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'compliance':
        return <CheckCircle className="h-5 w-5 text-yellow-400" />;
      case 'network_security':
        return <Bell className="h-5 w-5 text-purple-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const patientSafetyAlerts = alerts.filter(a => a.patientImpact).length;
  const hipaaAlerts = alerts.filter(a => a.hipaaRelevant).length;

  return (
    <div className="space-y-6">
      {/* Alert Overview */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Bell className="h-6 w-6 text-yellow-400 mr-2" />
            Hospital Security Alerts
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Alert Types</option>
              <option value="patient_safety">Patient Safety</option>
              <option value="data_security">Data Security</option>
              <option value="device_malfunction">Device Issues</option>
              <option value="compliance">Compliance</option>
              <option value="network_security">Network Security</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <div className="text-red-400 text-2xl font-bold">{criticalAlerts}</div>
            <div className="text-gray-400 text-sm">Critical Alerts</div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50">
            <div className="text-orange-400 text-2xl font-bold">{unacknowledgedAlerts}</div>
            <div className="text-gray-400 text-sm">Unacknowledged</div>
          </div>
          <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-700/50">
            <div className="text-pink-400 text-2xl font-bold">{patientSafetyAlerts}</div>
            <div className="text-gray-400 text-sm">Patient Safety</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
            <div className="text-blue-400 text-2xl font-bold">{hipaaAlerts}</div>
            <div className="text-gray-400 text-sm">HIPAA Related</div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Active Security Alerts</h3>
        
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-400">No active alerts</p>
            <p className="text-gray-500 text-sm">All hospital systems are secure</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-opacity-80 ${
                  alert.acknowledged ? 'opacity-60' : ''
                } ${getSeverityColor(alert.severity)}`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {alert.requiresImmedateAction && (
                          <span className="text-xs px-2 py-1 bg-red-600 text-white rounded font-medium animate-pulse">
                            IMMEDIATE ACTION
                          </span>
                        )}
                        {alert.patientImpact && (
                          <span className="text-xs px-2 py-1 bg-pink-900/50 text-pink-300 rounded">
                            PATIENT IMPACT
                          </span>
                        )}
                        {alert.hipaaRelevant && (
                          <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded">
                            HIPAA
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium text-sm">{alert.title}</div>
                      <div className="text-gray-300 text-sm mt-1">{alert.message}</div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.timestamp.toLocaleString()}
                        </span>
                        <span>Source: {alert.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    {!alert.acknowledged && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeAlert(alert.id);
                        }}
                        className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
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
                {getAlertIcon(selectedAlert.type)}
                <span className="ml-2">Alert Details</span>
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
                    {selectedAlert.type.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Severity:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                    {selectedAlert.severity.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Source:</span>
                  <div className="text-white font-medium">{selectedAlert.source}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Timestamp:</span>
                  <div className="text-white font-medium">{selectedAlert.timestamp.toLocaleString()}</div>
                </div>
              </div>
              
              <div>
                <span className="text-gray-400 text-sm">Message:</span>
                <p className="text-white mt-1 bg-gray-900 p-3 rounded-lg">{selectedAlert.message}</p>
              </div>
              
              {/* Impact Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-3 rounded-lg border ${
                  selectedAlert.patientImpact 
                    ? 'bg-red-900/20 border-red-700/50' 
                    : 'bg-green-900/20 border-green-700/50'
                }`}>
                  <div className={`text-sm font-medium ${selectedAlert.patientImpact ? 'text-red-300' : 'text-green-300'}`}>
                    Patient Impact
                  </div>
                  <div className={`text-xs ${selectedAlert.patientImpact ? 'text-red-400' : 'text-green-400'}`}>
                    {selectedAlert.patientImpact ? 'YES' : 'NO'}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg border ${
                  selectedAlert.hipaaRelevant 
                    ? 'bg-blue-900/20 border-blue-700/50' 
                    : 'bg-green-900/20 border-green-700/50'
                }`}>
                  <div className={`text-sm font-medium ${selectedAlert.hipaaRelevant ? 'text-blue-300' : 'text-green-300'}`}>
                    HIPAA Relevant
                  </div>
                  <div className={`text-xs ${selectedAlert.hipaaRelevant ? 'text-blue-400' : 'text-green-400'}`}>
                    {selectedAlert.hipaaRelevant ? 'YES' : 'NO'}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg border ${
                  selectedAlert.requiresImmedateAction 
                    ? 'bg-orange-900/20 border-orange-700/50' 
                    : 'bg-green-900/20 border-green-700/50'
                }`}>
                  <div className={`text-sm font-medium ${selectedAlert.requiresImmedateAction ? 'text-orange-300' : 'text-green-300'}`}>
                    Immediate Action
                  </div>
                  <div className={`text-xs ${selectedAlert.requiresImmedateAction ? 'text-orange-400' : 'text-green-400'}`}>
                    {selectedAlert.requiresImmedateAction ? 'REQUIRED' : 'NOT REQUIRED'}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                {!selectedAlert.acknowledged && (
                  <button
                    onClick={() => {
                      acknowledgeAlert(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Acknowledge Alert
                  </button>
                )}
                
                {selectedAlert.patientImpact && (
                  <button
                    onClick={() => {
                      console.log('Notifying clinical team for alert:', selectedAlert.id);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Notify Clinical Team
                  </button>
                )}
                
                {selectedAlert.hipaaRelevant && (
                  <button
                    onClick={() => {
                      console.log('Initiating HIPAA protocol for alert:', selectedAlert.id);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    HIPAA Protocol
                  </button>
                )}
                
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