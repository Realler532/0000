import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock, Shield, Scale } from 'lucide-react';
import { ComplianceAlert } from '../types/healthcare';

interface ComplianceMonitorProps {
  alerts: ComplianceAlert[];
}

export function ComplianceMonitor({ alerts }: ComplianceMonitorProps) {
  const [selectedAlert, setSelectedAlert] = useState<ComplianceAlert | null>(null);
  const [filterRegulation, setFilterRegulation] = useState<string>('all');

  const filteredAlerts = filterRegulation === 'all' 
    ? alerts 
    : alerts.filter(a => a.regulation === filterRegulation);

  const getRegulationIcon = (regulation: string) => {
    switch (regulation) {
      case 'hipaa':
        return '🏥';
      case 'hitech':
        return '💻';
      case 'fda':
        return '💊';
      case 'joint_commission':
        return '🏛️';
      case 'cms':
        return '📋';
      default:
        return '📜';
    }
  };

  const getRegulationColor = (regulation: string) => {
    switch (regulation) {
      case 'hipaa':
        return 'text-blue-400 bg-blue-900/30';
      case 'hitech':
        return 'text-purple-400 bg-purple-900/30';
      case 'fda':
        return 'text-green-400 bg-green-900/30';
      case 'joint_commission':
        return 'text-orange-400 bg-orange-900/30';
      case 'cms':
        return 'text-yellow-400 bg-yellow-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-red-400';
      case 'in_progress':
        return 'text-yellow-400';
      case 'resolved':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const openAlerts = alerts.filter(a => a.status === 'open').length;
  const inProgressAlerts = alerts.filter(a => a.status === 'in_progress').length;
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;
  const overdueAlerts = alerts.filter(a => a.deadline && new Date() > a.deadline && a.status !== 'resolved').length;

  const complianceScore = Math.max(0, 100 - (openAlerts * 5) - (overdueAlerts * 10));

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Scale className="h-6 w-6 text-yellow-400 mr-2" />
            Healthcare Compliance Monitor
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{complianceScore}%</div>
              <div className="text-gray-400 text-sm">Compliance Score</div>
            </div>
            <select
              value={filterRegulation}
              onChange={(e) => setFilterRegulation(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Regulations</option>
              <option value="hipaa">HIPAA</option>
              <option value="hitech">HITECH</option>
              <option value="fda">FDA</option>
              <option value="joint_commission">Joint Commission</option>
              <option value="cms">CMS</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <div className="text-red-400 text-2xl font-bold">{openAlerts}</div>
            <div className="text-gray-400 text-sm">Open Violations</div>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-700/50">
            <div className="text-yellow-400 text-2xl font-bold">{inProgressAlerts}</div>
            <div className="text-gray-400 text-sm">In Progress</div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
            <div className="text-green-400 text-2xl font-bold">{resolvedAlerts}</div>
            <div className="text-gray-400 text-sm">Resolved</div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/50">
            <div className="text-purple-400 text-2xl font-bold">{overdueAlerts}</div>
            <div className="text-gray-400 text-sm">Overdue</div>
          </div>
        </div>
      </div>

      {/* Compliance Alerts */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Compliance Violations</h3>
        
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-400">No compliance violations</p>
            <p className="text-gray-500 text-sm">All systems are compliant</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-opacity-80 ${getSeverityColor(alert.severity)}`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getRegulationIcon(alert.regulation)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRegulationColor(alert.regulation)}`}>
                          {alert.regulation.toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-white font-medium text-sm">{alert.violationType}</div>
                      <div className="text-gray-300 text-sm mt-1">{alert.description}</div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.createdAt.toLocaleString()}
                        </span>
                        {alert.deadline && (
                          <span className={`flex items-center ${
                            new Date() > alert.deadline ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            ⏰ Due: {alert.deadline.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                
                {alert.affectedSystems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Affected Systems:</p>
                    <div className="flex flex-wrap gap-1">
                      {alert.affectedSystems.map((system, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-red-900/50 text-red-300 rounded"
                        >
                          {system}
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
          <div className="bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="text-2xl mr-3">{getRegulationIcon(selectedAlert.regulation)}</span>
                Compliance Violation Details
              </h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Violation Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Regulation:</span> <span className="text-white font-medium">{selectedAlert.regulation.toUpperCase()}</span></div>
                    <div><span className="text-gray-400">Type:</span> <span className="text-white">{selectedAlert.violationType}</span></div>
                    <div><span className="text-gray-400">Severity:</span> <span className={`font-medium ${getSeverityColor(selectedAlert.severity).split(' ')[0]}`}>{selectedAlert.severity.toUpperCase()}</span></div>
                    <div><span className="text-gray-400">Status:</span> <span className={`font-medium ${getStatusColor(selectedAlert.status)}`}>{selectedAlert.status.replace('_', ' ').toUpperCase()}</span></div>
                    <div><span className="text-gray-400">Created:</span> <span className="text-white">{selectedAlert.createdAt.toLocaleString()}</span></div>
                    {selectedAlert.deadline && (
                      <div><span className="text-gray-400">Deadline:</span> <span className={`font-medium ${new Date() > selectedAlert.deadline ? 'text-red-400' : 'text-yellow-400'}`}>{selectedAlert.deadline.toLocaleString()}</span></div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Impact Assessment</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Affected Systems:</span> <span className="text-white">{selectedAlert.affectedSystems.length}</span></div>
                    <div className="space-y-1">
                      {selectedAlert.affectedSystems.map((system, index) => (
                        <div key={index} className="text-gray-300 text-xs">• {system}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                <p className="text-gray-300 bg-gray-900 p-4 rounded-lg">{selectedAlert.description}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Remediation Steps</h4>
                <div className="space-y-2">
                  {selectedAlert.remediation.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="text-gray-300 text-sm">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    console.log('Starting remediation for alert:', selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Start Remediation
                </button>
                <button
                  onClick={() => {
                    console.log('Marking alert as resolved:', selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Mark Resolved
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