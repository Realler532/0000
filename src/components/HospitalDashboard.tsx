import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Heart, 
  Database, 
  Wifi, 
  Lock,
  Users,
  FileText,
  Settings,
  Bell,
  TrendingUp,
  Monitor
} from 'lucide-react';
import { HospitalThreatMap } from './HospitalThreatMap';
import { MedicalDeviceMonitor } from './MedicalDeviceMonitor';
import { PatientDataSecurityPanel } from './PatientDataSecurityPanel';
import { ComplianceMonitor } from './ComplianceMonitor';
import { HospitalIncidentList } from './HospitalIncidentList';
import { HospitalAlertPanel } from './HospitalAlertPanel';
import { MLThreatAnalysis } from './MLThreatAnalysis';
import { useHospitalData } from '../hooks/useHospitalData';
import { User } from '../types/user';

interface HospitalDashboardProps {
  user: User | null;
  onLogout?: () => void;
}

export function HospitalDashboard({ user, onLogout }: HospitalDashboardProps) {
  const {
    hospitalSystems,
    medicalDeviceThreats,
    complianceAlerts,
    patientDataAlerts,
    securityMetrics,
    isMonitoring,
    toggleMonitoring
  } = useHospitalData();

  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Calculate dashboard statistics
  const criticalSystems = hospitalSystems.filter(s => s.status === 'error' || s.status === 'offline').length;
  const activeMedicalThreats = medicalDeviceThreats.filter(t => t.severity === 'critical' || t.severity === 'high').length;
  const hipaaViolations = complianceAlerts.filter(a => a.regulation === 'hipaa' && a.status === 'open').length;
  const patientDataRisks = patientDataAlerts.filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high').length;

  const menuItems = [
    { id: 'overview', label: 'Security Overview', icon: Shield, count: null },
    { id: 'threats', label: 'Active Threats', icon: AlertTriangle, count: activeMedicalThreats, color: 'text-red-400' },
    { id: 'devices', label: 'Medical Devices', icon: Heart, count: hospitalSystems.filter(s => s.type === 'medical_device').length, color: 'text-pink-400' },
    { id: 'patient-data', label: 'Patient Data Security', icon: Lock, count: patientDataRisks, color: 'text-blue-400' },
    { id: 'compliance', label: 'Compliance Monitor', icon: FileText, count: hipaaViolations, color: 'text-yellow-400' },
    { id: 'network', label: 'Network Security', icon: Wifi, count: null, color: 'text-green-400' },
    { id: 'ml-analysis', label: 'ML Threat Analysis', icon: TrendingUp, count: null, color: 'text-purple-400' },
    { id: 'incidents', label: 'Incident Response', icon: Bell, count: null, color: 'text-orange-400' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'threats':
        return <HospitalThreatMap threats={medicalDeviceThreats} />;
      case 'devices':
        return <MedicalDeviceMonitor systems={hospitalSystems} threats={medicalDeviceThreats} />;
      case 'patient-data':
        return <PatientDataSecurityPanel alerts={patientDataAlerts} />;
      case 'compliance':
        return <ComplianceMonitor alerts={complianceAlerts} />;
      case 'ml-analysis':
        return <MLThreatAnalysis />;
      case 'incidents':
        return <HospitalIncidentList />;
      default:
        return (
          <div className="space-y-6">
            {/* Hospital Security Overview */}
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Hospital Cybersecurity Center
              </h2>
              <p className="text-gray-400 text-lg">
                Protecting Patient Care Through Advanced Security
              </p>
            </div>

            {/* Critical Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-xl p-6 border border-red-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-300 text-sm font-medium">Critical Systems</p>
                    <p className="text-3xl font-bold text-white mt-1">{criticalSystems}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <div className="mt-4 text-xs text-red-200">
                  Systems requiring immediate attention
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 rounded-xl p-6 border border-pink-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-300 text-sm font-medium">Medical Device Threats</p>
                    <p className="text-3xl font-bold text-white mt-1">{activeMedicalThreats}</p>
                  </div>
                  <Heart className="h-8 w-8 text-pink-400" />
                </div>
                <div className="mt-4 text-xs text-pink-200">
                  Active threats to medical equipment
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 rounded-xl p-6 border border-yellow-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">HIPAA Violations</p>
                    <p className="text-3xl font-bold text-white mt-1">{hipaaViolations}</p>
                  </div>
                  <FileText className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="mt-4 text-xs text-yellow-200">
                  Open compliance violations
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Patient Data Risks</p>
                    <p className="text-3xl font-bold text-white mt-1">{patientDataRisks}</p>
                  </div>
                  <Lock className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-4 text-xs text-blue-200">
                  High-risk patient data events
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Monitor className="h-6 w-6 text-green-400 mr-2" />
                Hospital Security Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-300 text-sm">Overall Threat Level</span>
                    <div className={`w-4 h-4 rounded-full ${
                      securityMetrics.threatLevel === 'green' ? 'bg-green-400' :
                      securityMetrics.threatLevel === 'yellow' ? 'bg-yellow-400' :
                      securityMetrics.threatLevel === 'orange' ? 'bg-orange-400' :
                      'bg-red-400'
                    }`} />
                  </div>
                  <div className="text-2xl font-bold text-white capitalize">
                    {securityMetrics.threatLevel}
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-300 text-sm">Compliance Score</span>
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {securityMetrics.complianceScore}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    HIPAA/HITECH compliance
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-300 text-sm">Patient Data Security</span>
                    <Lock className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {securityMetrics.patientDataSecurity}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    PHI protection level
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveSection('devices')}
                  className="p-4 bg-pink-900/30 hover:bg-pink-900/50 border border-pink-700/50 rounded-lg transition-colors text-left"
                >
                  <Heart className="h-6 w-6 text-pink-400 mb-2" />
                  <div className="text-white font-medium">Medical Devices</div>
                  <div className="text-pink-300 text-sm">Monitor critical equipment</div>
                </button>

                <button
                  onClick={() => setActiveSection('patient-data')}
                  className="p-4 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50 rounded-lg transition-colors text-left"
                >
                  <Lock className="h-6 w-6 text-blue-400 mb-2" />
                  <div className="text-white font-medium">Patient Data</div>
                  <div className="text-blue-300 text-sm">Secure PHI access</div>
                </button>

                <button
                  onClick={() => setActiveSection('compliance')}
                  className="p-4 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700/50 rounded-lg transition-colors text-left"
                >
                  <FileText className="h-6 w-6 text-yellow-400 mb-2" />
                  <div className="text-white font-medium">Compliance</div>
                  <div className="text-yellow-300 text-sm">HIPAA monitoring</div>
                </button>

                <button
                  onClick={() => setActiveSection('ml-analysis')}
                  className="p-4 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/50 rounded-lg transition-colors text-left"
                >
                  <TrendingUp className="h-6 w-6 text-purple-400 mb-2" />
                  <div className="text-white font-medium">ML Analysis</div>
                  <div className="text-purple-300 text-sm">AI threat detection</div>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-pink-400" />
                <span className="font-semibold text-white">Hospital SOC</span>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 ${
                  activeSection === item.id ? 'text-white' : item.color || 'text-gray-400'
                }`} />
                
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">
                      {item.label}
                    </span>
                    {item.count !== null && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeSection === item.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Status Indicator */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              securityMetrics.threatLevel === 'green' ? 'bg-green-400' :
              securityMetrics.threatLevel === 'yellow' ? 'bg-yellow-400' :
              securityMetrics.threatLevel === 'orange' ? 'bg-orange-400' :
              'bg-red-400'
            } animate-pulse`}></div>
            {!sidebarCollapsed && (
              <span className="text-xs text-gray-400">
                Threat Level: {securityMetrics.threatLevel.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-pink-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Hospital Security Center'}
                </h1>
                <p className="text-sm text-gray-400">
                  Healthcare Cybersecurity Operations{user ? ` • ${user.firstName} ${user.lastName}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              )}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-sm text-gray-300">
                  {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
                </span>
              </div>
              <button
                onClick={toggleMonitoring}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isMonitoring 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isMonitoring ? 'Pause' : 'Resume'} Monitoring
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-6 py-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}