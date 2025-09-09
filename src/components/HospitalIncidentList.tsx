import React, { useState } from 'react';
import { AlertTriangle, Clock, Heart, Shield, FileText, CheckCircle } from 'lucide-react';

interface HospitalIncident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  type: 'medical_device_compromise' | 'patient_data_breach' | 'ransomware' | 'network_intrusion' | 'compliance_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
  patientImpact: 'none' | 'low' | 'medium' | 'high' | 'life_threatening';
  hipaaImpact: boolean;
  affectedSystems: string[];
  affectedPatients: number;
  detectedAt: Date;
  responseTeam: string[];
  mitigationSteps: string[];
}

export function HospitalIncidentList() {
  const [incidents, setIncidents] = useState<HospitalIncident[]>([
    {
      id: '1',
      incidentNumber: 'HOSP-2025-001',
      title: 'Unauthorized Access to Ventilator Network',
      description: 'Suspicious network activity detected on critical care ventilator systems',
      type: 'medical_device_compromise',
      severity: 'critical',
      status: 'investigating',
      patientImpact: 'life_threatening',
      hipaaImpact: false,
      affectedSystems: ['Ventilator Network', 'ICU Monitoring'],
      affectedPatients: 12,
      detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      responseTeam: ['Security Team', 'Biomedical Engineering', 'ICU Staff'],
      mitigationSteps: ['Isolate affected devices', 'Switch to manual monitoring', 'Notify clinical staff']
    },
    {
      id: '2',
      incidentNumber: 'HOSP-2025-002',
      title: 'Patient Data Exfiltration Attempt',
      description: 'Large volume of patient records accessed from unauthorized location',
      type: 'patient_data_breach',
      severity: 'high',
      status: 'contained',
      patientImpact: 'medium',
      hipaaImpact: true,
      affectedSystems: ['EHR System', 'Patient Portal'],
      affectedPatients: 1247,
      detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      responseTeam: ['Security Team', 'Privacy Officer', 'Legal Team'],
      mitigationSteps: ['Block unauthorized access', 'Audit access logs', 'Prepare breach notification']
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState<HospitalIncident | null>(null);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'medical_device_compromise':
        return <Heart className="h-5 w-5 text-red-400" />;
      case 'patient_data_breach':
        return <Shield className="h-5 w-5 text-blue-400" />;
      case 'ransomware':
        return <AlertTriangle className="h-5 w-5 text-purple-400" />;
      case 'network_intrusion':
        return <FileText className="h-5 w-5 text-orange-400" />;
      case 'compliance_violation':
        return <FileText className="h-5 w-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected':
        return 'text-red-400';
      case 'investigating':
        return 'text-yellow-400';
      case 'contained':
        return 'text-blue-400';
      case 'resolved':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleResolveIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { ...incident, status: 'resolved' as const }
        : incident
    ));
  };

  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
  const activeIncidents = incidents.filter(i => i.status !== 'resolved').length;
  const lifeThreatening = incidents.filter(i => i.patientImpact === 'life_threatening').length;
  const hipaaIncidents = incidents.filter(i => i.hipaaImpact).length;

  return (
    <div className="space-y-6">
      {/* Incident Overview */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-400 mr-2" />
            Hospital Incident Response
          </h2>
          <div className="text-sm text-gray-400">
            {activeIncidents} active incidents
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <div className="text-red-400 text-2xl font-bold">{criticalIncidents}</div>
            <div className="text-gray-400 text-sm">Critical Incidents</div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50">
            <div className="text-orange-400 text-2xl font-bold">{activeIncidents}</div>
            <div className="text-gray-400 text-sm">Active Incidents</div>
          </div>
          <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-700/50">
            <div className="text-pink-400 text-2xl font-bold">{lifeThreatening}</div>
            <div className="text-gray-400 text-sm">Life Threatening</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
            <div className="text-blue-400 text-2xl font-bold">{hipaaIncidents}</div>
            <div className="text-gray-400 text-sm">HIPAA Impact</div>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Active Security Incidents</h3>
        
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-opacity-80 ${getSeverityColor(incident.severity)}`}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {getIncidentIcon(incident.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-mono bg-gray-700 px-2 py-1 rounded">
                        {incident.incidentNumber}
                      </span>
                      <span className={`text-xs font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-white font-medium text-sm">{incident.title}</div>
                    <div className="text-gray-300 text-sm mt-1">{incident.description}</div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {incident.detectedAt.toLocaleString()}
                      </span>
                      <span className={`flex items-center ${getPatientImpactColor(incident.patientImpact)}`}>
                        <Heart className="h-3 w-3 mr-1" />
                        Patient Impact: {incident.patientImpact.replace('_', ' ').toUpperCase()}
                      </span>
                      <span>👥 {incident.affectedPatients} patients</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                    {incident.severity.toUpperCase()}
                  </span>
                  {incident.hipaaImpact && (
                    <div className="text-blue-300 text-xs mt-1">🔒 HIPAA Impact</div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {incident.affectedSystems.slice(0, 3).map((system, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                  >
                    {system}
                  </span>
                ))}
                {incident.affectedSystems.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                    +{incident.affectedSystems.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                {getIncidentIcon(selectedIncident.type)}
                <span className="ml-2">{selectedIncident.title}</span>
              </h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Incident Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Incident Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Incident #:</span> <span className="text-white font-mono">{selectedIncident.incidentNumber}</span></div>
                    <div><span className="text-gray-400">Type:</span> <span className="text-white capitalize">{selectedIncident.type.replace('_', ' ')}</span></div>
                    <div><span className="text-gray-400">Severity:</span> <span className={`font-medium ${getSeverityColor(selectedIncident.severity).split(' ')[0]}`}>{selectedIncident.severity.toUpperCase()}</span></div>
                    <div><span className="text-gray-400">Status:</span> <span className={`font-medium ${getStatusColor(selectedIncident.status)}`}>{selectedIncident.status.toUpperCase()}</span></div>
                    <div><span className="text-gray-400">Detected:</span> <span className="text-white">{selectedIncident.detectedAt.toLocaleString()}</span></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Impact Assessment</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Patient Impact:</span> <span className={`font-medium ${getPatientImpactColor(selectedIncident.patientImpact)}`}>{selectedIncident.patientImpact.replace('_', ' ').toUpperCase()}</span></div>
                    <div><span className="text-gray-400">Affected Patients:</span> <span className="text-white font-medium">{selectedIncident.affectedPatients}</span></div>
                    <div><span className="text-gray-400">HIPAA Impact:</span> <span className={`font-medium ${selectedIncident.hipaaImpact ? 'text-red-400' : 'text-green-400'}`}>{selectedIncident.hipaaImpact ? 'YES' : 'NO'}</span></div>
                    <div><span className="text-gray-400">Systems Affected:</span> <span className="text-white">{selectedIncident.affectedSystems.length}</span></div>
                  </div>
                </div>
              </div>
              
              {/* Patient Safety Alert */}
              {selectedIncident.patientImpact === 'life_threatening' && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-300 font-medium mb-2">
                    <Heart className="h-5 w-5" />
                    <span>CRITICAL PATIENT SAFETY ALERT</span>
                  </div>
                  <p className="text-red-200 text-sm">
                    This incident may pose immediate risk to patient safety. Clinical teams have been notified and backup systems are in use.
                  </p>
                </div>
              )}
              
              {/* HIPAA Impact Alert */}
              {selectedIncident.hipaaImpact && (
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-300 font-medium mb-2">
                    <Shield className="h-5 w-5" />
                    <span>HIPAA COMPLIANCE IMPACT</span>
                  </div>
                  <p className="text-blue-200 text-sm">
                    This incident involves protected health information (PHI). Privacy officer and legal team have been notified.
                  </p>
                </div>
              )}
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                <p className="text-gray-300 bg-gray-900 p-4 rounded-lg">{selectedIncident.description}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Affected Systems</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedIncident.affectedSystems.map((system, index) => (
                    <div key={index} className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                      <div className="text-red-300 font-medium text-sm">{system}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Response Team</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIncident.responseTeam.map((team, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm"
                    >
                      {team}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Mitigation Steps</h4>
                <div className="space-y-2">
                  {selectedIncident.mitigationSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="text-gray-300 text-sm">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                {selectedIncident.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      handleResolveIncident(selectedIncident.id);
                      setSelectedIncident(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => {
                    console.log('Escalating incident:', selectedIncident.id);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Escalate to Clinical Leadership
                </button>
                <button
                  onClick={() => setSelectedIncident(null)}
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