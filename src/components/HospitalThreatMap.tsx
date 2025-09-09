import React, { useState, useRef, useEffect } from 'react';
import { MapPin, AlertTriangle, Heart, Shield, Activity } from 'lucide-react';
import { MedicalDeviceThreat } from '../types/healthcare';

interface HospitalThreatMapProps {
  threats: MedicalDeviceThreat[];
}

export function HospitalThreatMap({ threats }: HospitalThreatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedThreat, setSelectedThreat] = useState<MedicalDeviceThreat | null>(null);

  const hospitalFloors = [
    { id: 'icu', name: 'ICU', x: 20, y: 15, color: 'bg-red-500' },
    { id: 'er', name: 'Emergency', x: 70, y: 20, color: 'bg-orange-500' },
    { id: 'surgery', name: 'Surgery', x: 45, y: 35, color: 'bg-purple-500' },
    { id: 'radiology', name: 'Radiology', x: 25, y: 60, color: 'bg-blue-500' },
    { id: 'pharmacy', name: 'Pharmacy', x: 75, y: 70, color: 'bg-green-500' },
    { id: 'lab', name: 'Laboratory', x: 50, y: 80, color: 'bg-yellow-500' }
  ];

  const getThreatIcon = (threatType: string) => {
    switch (threatType) {
      case 'unauthorized_access':
        return '🔓';
      case 'malware':
        return '🦠';
      case 'data_breach':
        return '📊';
      case 'device_tampering':
        return '⚙️';
      case 'network_intrusion':
        return '🌐';
      default:
        return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPatientImpactColor = (impact: string) => {
    switch (impact) {
      case 'life_threatening':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-blue-400';
      case 'none':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const criticalThreats = threats.filter(t => t.severity === 'critical').length;
  const highThreats = threats.filter(t => t.severity === 'high').length;
  const lifeThreatening = threats.filter(t => t.patientImpact === 'life_threatening').length;
  const hipaaImpacts = threats.filter(t => t.hipaaImpact).length;

  return (
    <div className="space-y-6">
      {/* Threat Statistics */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Heart className="h-6 w-6 text-pink-400 mr-2" />
            Hospital Threat Landscape
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <span className="text-pink-400 text-sm">Live Medical Device Monitoring</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <div className="text-red-400 text-2xl font-bold">{criticalThreats}</div>
            <div className="text-gray-400 text-sm">Critical Threats</div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50">
            <div className="text-orange-400 text-2xl font-bold">{highThreats}</div>
            <div className="text-gray-400 text-sm">High Priority</div>
          </div>
          <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-700/50">
            <div className="text-pink-400 text-2xl font-bold">{lifeThreatening}</div>
            <div className="text-gray-400 text-sm">Life Threatening</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
            <div className="text-blue-400 text-2xl font-bold">{hipaaImpacts}</div>
            <div className="text-gray-400 text-sm">HIPAA Impact</div>
          </div>
        </div>
      </div>

      {/* Hospital Floor Map */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <MapPin className="h-5 w-5 text-blue-400 mr-2" />
          Hospital Floor Plan - Threat Locations
        </h3>
        
        <div 
          ref={mapRef}
          className="relative bg-gray-900 rounded-lg h-96 overflow-hidden border border-gray-600"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Cpath d='M20 20h20v20H20V20zm-20 0h20v20H0V20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Hospital Departments */}
          {hospitalFloors.map((floor) => (
            <div
              key={floor.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${floor.x}%`, top: `${floor.y}%` }}
            >
              <div className={`w-12 h-12 ${floor.color} rounded-lg flex items-center justify-center shadow-lg border-2 border-white/20`}>
                <span className="text-white text-xs font-bold">{floor.name.slice(0, 3)}</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <span className="text-white text-xs bg-gray-800 px-2 py-1 rounded">{floor.name}</span>
              </div>
            </div>
          ))}

          {/* Threat Indicators */}
          {threats.slice(0, 20).map((threat, index) => {
            const floor = hospitalFloors[index % hospitalFloors.length];
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            
            return (
              <div
                key={threat.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ 
                  left: `${Math.max(5, Math.min(95, floor.x + offsetX))}%`, 
                  top: `${Math.max(5, Math.min(95, floor.y + offsetY))}%`,
                  animationDelay: `${index * 0.2}s`
                }}
                onClick={() => setSelectedThreat(threat)}
              >
                <div className={`w-6 h-6 ${getSeverityColor(threat.severity)} rounded-full animate-pulse flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {getThreatIcon(threat.threatType)}
                </div>
                
                {/* Pulsing ring for critical threats */}
                {threat.severity === 'critical' && (
                  <div className={`absolute inset-0 ${getSeverityColor(threat.severity)} rounded-full animate-ping opacity-75`}></div>
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-gray-600">
                  <div className="font-medium">{threat.deviceName}</div>
                  <div className="text-gray-300">{threat.threatType.replace('_', ' ')}</div>
                  <div className={`${getPatientImpactColor(threat.patientImpact)}`}>
                    Patient Impact: {threat.patientImpact.replace('_', ' ')}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-3 border border-gray-600">
            <div className="text-white text-sm font-medium mb-2">Threat Severity</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300 text-xs">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-300 text-xs">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300 text-xs">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300 text-xs">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Details Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Heart className="h-6 w-6 text-pink-400 mr-2" />
                Medical Device Threat Details
              </h3>
              <button
                onClick={() => setSelectedThreat(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Device:</span>
                  <div className="text-white font-medium">{selectedThreat.deviceName}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Threat Type:</span>
                  <div className="text-white font-medium capitalize">
                    {selectedThreat.threatType.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Severity:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedThreat.severity === 'critical' ? 'bg-red-900/50 text-red-300' :
                    selectedThreat.severity === 'high' ? 'bg-orange-900/50 text-orange-300' :
                    selectedThreat.severity === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                    'bg-blue-900/50 text-blue-300'
                  }`}>
                    {selectedThreat.severity.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Patient Impact:</span>
                  <div className={`font-medium ${getPatientImpactColor(selectedThreat.patientImpact)}`}>
                    {selectedThreat.patientImpact.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div>
                <span className="text-gray-400 text-sm">Description:</span>
                <p className="text-white mt-1">{selectedThreat.description}</p>
              </div>
              
              {selectedThreat.affectedPatients && (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                  <div className="text-red-300 font-medium">
                    ⚠️ {selectedThreat.affectedPatients} patients potentially affected
                  </div>
                </div>
              )}
              
              {selectedThreat.hipaaImpact && (
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                  <div className="text-blue-300 font-medium">
                    🔒 HIPAA compliance impact detected
                  </div>
                </div>
              )}
              
              <div>
                <span className="text-gray-400 text-sm">Mitigation Steps:</span>
                <ul className="mt-2 space-y-1">
                  {selectedThreat.mitigationSteps.map((step, index) => (
                    <li key={index} className="text-white text-sm flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    // Handle threat resolution
                    setSelectedThreat(null);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => {
                    // Handle escalation
                    console.log('Escalating threat:', selectedThreat.id);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Escalate to Clinical Team
                </button>
                <button
                  onClick={() => setSelectedThreat(null)}
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