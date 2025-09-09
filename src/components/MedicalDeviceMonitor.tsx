import React, { useState } from 'react';
import { Heart, Wifi, Shield, AlertTriangle, Activity, Zap, Monitor } from 'lucide-react';
import { HospitalSystem, MedicalDeviceThreat } from '../types/healthcare';

interface MedicalDeviceMonitorProps {
  systems: HospitalSystem[];
  threats: MedicalDeviceThreat[];
}

export function MedicalDeviceMonitor({ systems, threats }: MedicalDeviceMonitorProps) {
  const [selectedDevice, setSelectedDevice] = useState<HospitalSystem | null>(null);
  const [filterCriticality, setFilterCriticality] = useState<string>('all');

  const medicalDevices = systems.filter(s => s.type === 'medical_device');
  const filteredDevices = filterCriticality === 'all' 
    ? medicalDevices 
    : medicalDevices.filter(d => d.criticality === filterCriticality);

  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.toLowerCase().includes('ventilator')) return '🫁';
    if (deviceName.toLowerCase().includes('monitor')) return '📊';
    if (deviceName.toLowerCase().includes('pump')) return '💉';
    if (deviceName.toLowerCase().includes('scanner')) return '🔍';
    if (deviceName.toLowerCase().includes('xray')) return '☢️';
    return '🏥';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Activity className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <Zap className="h-5 w-5 text-red-400" />;
      case 'offline':
        return <Monitor className="h-5 w-5 text-gray-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
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

  const getDeviceThreats = (deviceId: string) => {
    return threats.filter(t => t.deviceId === deviceId);
  };

  const onlineDevices = medicalDevices.filter(d => d.status === 'online').length;
  const criticalDevices = medicalDevices.filter(d => d.criticality === 'critical').length;
  const devicesWithThreats = medicalDevices.filter(d => getDeviceThreats(d.id).length > 0).length;

  return (
    <div className="space-y-6">
      {/* Medical Device Overview */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Heart className="h-6 w-6 text-pink-400 mr-2" />
            Medical Device Security Monitor
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={filterCriticality}
              onChange={(e) => setFilterCriticality(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Devices</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
            <div className="text-green-400 text-2xl font-bold">{onlineDevices}</div>
            <div className="text-gray-400 text-sm">Devices Online</div>
          </div>
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <div className="text-red-400 text-2xl font-bold">{criticalDevices}</div>
            <div className="text-gray-400 text-sm">Critical Devices</div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50">
            <div className="text-orange-400 text-2xl font-bold">{devicesWithThreats}</div>
            <div className="text-gray-400 text-sm">Devices at Risk</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
            <div className="text-blue-400 text-2xl font-bold">{medicalDevices.length}</div>
            <div className="text-gray-400 text-sm">Total Monitored</div>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Medical Device Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => {
            const deviceThreats = getDeviceThreats(device.id);
            const hasThreats = deviceThreats.length > 0;
            const highestThreat = deviceThreats.reduce((max, threat) => 
              threat.severity === 'critical' ? threat : 
              threat.severity === 'high' && max.severity !== 'critical' ? threat : max, 
              deviceThreats[0]
            );

            return (
              <div
                key={device.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                  hasThreats 
                    ? 'bg-red-900/20 border-red-700/50 hover:bg-red-900/30' 
                    : device.status === 'online' 
                      ? 'bg-green-900/20 border-green-700/50 hover:bg-green-900/30'
                      : 'bg-gray-900/50 border-gray-700/50 hover:bg-gray-900/70'
                }`}
                onClick={() => setSelectedDevice(device)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getDeviceIcon(device.name)}</div>
                    <div>
                      <div className="text-white font-medium text-sm">{device.name}</div>
                      <div className="text-gray-400 text-xs">{device.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(device.status)}
                    {hasThreats && (
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Criticality:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCriticalityColor(device.criticality)}`}>
                      {device.criticality.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Status:</span>
                    <span className={`text-xs font-medium ${
                      device.status === 'online' ? 'text-green-400' :
                      device.status === 'warning' ? 'text-yellow-400' :
                      device.status === 'error' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                      {device.status.toUpperCase()}
                    </span>
                  </div>

                  {hasThreats && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-red-300 text-xs font-medium mb-1">
                        ⚠️ {deviceThreats.length} Active Threat{deviceThreats.length > 1 ? 's' : ''}
                      </div>
                      {highestThreat && (
                        <div className="text-gray-300 text-xs">
                          Highest: {highestThreat.threatType.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                  )}

                  {device.vulnerabilities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <div className="text-yellow-300 text-xs">
                        🔍 {device.vulnerabilities.length} Known Vulnerabilities
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Device Details Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="text-2xl mr-3">{getDeviceIcon(selectedDevice.name)}</span>
                {selectedDevice.name}
              </h3>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Device Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Device Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Type:</span> <span className="text-white capitalize">{selectedDevice.type.replace('_', ' ')}</span></div>
                    <div><span className="text-gray-400">Location:</span> <span className="text-white">{selectedDevice.location}</span></div>
                    <div><span className="text-gray-400">Department:</span> <span className="text-white">{selectedDevice.department}</span></div>
                    <div><span className="text-gray-400">Criticality:</span> <span className={`font-medium ${getCriticalityColor(selectedDevice.criticality).split(' ')[0]}`}>{selectedDevice.criticality.toUpperCase()}</span></div>
                    <div><span className="text-gray-400">Last Check:</span> <span className="text-white">{selectedDevice.lastHealthCheck.toLocaleString()}</span></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Security Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Status:</span>
                      {getStatusIcon(selectedDevice.status)}
                      <span className={`font-medium ${
                        selectedDevice.status === 'online' ? 'text-green-400' :
                        selectedDevice.status === 'warning' ? 'text-yellow-400' :
                        selectedDevice.status === 'error' ? 'text-red-400' :
                        'text-gray-400'
                      }`}>
                        {selectedDevice.status.toUpperCase()}
                      </span>
                    </div>
                    <div><span className="text-gray-400">Compliance:</span> <span className={`font-medium ${
                      selectedDevice.complianceStatus === 'compliant' ? 'text-green-400' :
                      selectedDevice.complianceStatus === 'pending_review' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{selectedDevice.complianceStatus.replace('_', ' ').toUpperCase()}</span></div>
                  </div>
                </div>
              </div>
              
              {/* Vulnerabilities */}
              {selectedDevice.vulnerabilities.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Known Vulnerabilities</h4>
                  <div className="space-y-2">
                    {selectedDevice.vulnerabilities.map((vuln, index) => (
                      <div key={index} className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                        <div className="text-yellow-300 font-medium text-sm">⚠️ {vuln}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Active Threats */}
              {getDeviceThreats(selectedDevice.id).length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Active Threats</h4>
                  <div className="space-y-3">
                    {getDeviceThreats(selectedDevice.id).map((threat) => (
                      <div key={threat.id} className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-red-300 font-medium">{threat.threatType.replace('_', ' ').toUpperCase()}</div>
                            <div className="text-gray-300 text-sm mt-1">{threat.description}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            threat.severity === 'critical' ? 'bg-red-900/50 text-red-300' :
                            threat.severity === 'high' ? 'bg-orange-900/50 text-orange-300' :
                            'bg-yellow-900/50 text-yellow-300'
                          }`}>
                            {threat.severity.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400">Patient Impact:</span>
                            <div className={`font-medium ${
                              threat.patientImpact === 'life_threatening' ? 'text-red-400' :
                              threat.patientImpact === 'high' ? 'text-orange-400' :
                              threat.patientImpact === 'medium' ? 'text-yellow-400' :
                              'text-blue-400'
                            }`}>
                              {threat.patientImpact.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">HIPAA Impact:</span>
                            <div className={`font-medium ${threat.hipaaImpact ? 'text-red-400' : 'text-green-400'}`}>
                              {threat.hipaaImpact ? 'YES' : 'NO'}
                            </div>
                          </div>
                        </div>
                        
                        {threat.affectedPatients && (
                          <div className="mt-3 pt-3 border-t border-red-700/50">
                            <div className="text-red-300 text-sm font-medium">
                              👥 {threat.affectedPatients} patients potentially affected
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    console.log('Running security scan on device:', selectedDevice.id);
                    setSelectedDevice(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Run Security Scan
                </button>
                <button
                  onClick={() => {
                    console.log('Isolating device:', selectedDevice.id);
                    setSelectedDevice(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Isolate Device
                </button>
                <button
                  onClick={() => setSelectedDevice(null)}
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