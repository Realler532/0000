import { useState, useEffect } from 'react';
import { HospitalSystem, MedicalDeviceThreat, ComplianceAlert, PatientDataAlert, SecurityMetrics } from '../types/healthcare';
import { mlThreatDetector } from '../services/mlThreatDetection';

export function useHospitalData() {
  const [hospitalSystems, setHospitalSystems] = useState<HospitalSystem[]>([]);
  const [medicalDeviceThreats, setMedicalDeviceThreats] = useState<MedicalDeviceThreat[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [patientDataAlerts, setPatientDataAlerts] = useState<PatientDataAlert[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    threatLevel: 'green',
    activeThreats: 0,
    criticalSystems: 0,
    complianceScore: 95,
    patientDataSecurity: 98,
    lastAssessment: new Date()
  });
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    // Initialize hospital systems
    initializeHospitalSystems();
    
    // Start monitoring simulation
    const monitoringInterval = setInterval(() => {
      if (isMonitoring) {
        simulateNetworkActivity();
        updateSecurityMetrics();
      }
    }, 3000);

    return () => clearInterval(monitoringInterval);
  }, [isMonitoring]);

  const initializeHospitalSystems = () => {
    const systems: HospitalSystem[] = [
      {
        id: 'ehr-001',
        name: 'Epic EHR System',
        type: 'ehr',
        criticality: 'critical',
        location: 'Data Center A',
        department: 'IT Infrastructure',
        status: 'online',
        lastHealthCheck: new Date(),
        vulnerabilities: [],
        complianceStatus: 'compliant'
      },
      {
        id: 'pacs-001',
        name: 'PACS Imaging System',
        type: 'pacs',
        criticality: 'critical',
        location: 'Radiology',
        department: 'Radiology',
        status: 'online',
        lastHealthCheck: new Date(),
        vulnerabilities: ['CVE-2023-1234'],
        complianceStatus: 'pending_review'
      },
      {
        id: 'device-001',
        name: 'Ventilator Network',
        type: 'medical_device',
        criticality: 'critical',
        location: 'ICU',
        department: 'Critical Care',
        status: 'warning',
        lastHealthCheck: new Date(),
        vulnerabilities: ['Unencrypted communications'],
        complianceStatus: 'compliant'
      },
      {
        id: 'pharmacy-001',
        name: 'Pharmacy Management System',
        type: 'pharmacy',
        criticality: 'high',
        location: 'Pharmacy',
        department: 'Pharmacy',
        status: 'online',
        lastHealthCheck: new Date(),
        vulnerabilities: [],
        complianceStatus: 'compliant'
      },
      {
        id: 'lab-001',
        name: 'Laboratory Information System',
        type: 'lis',
        criticality: 'high',
        location: 'Laboratory',
        department: 'Laboratory',
        status: 'online',
        lastHealthCheck: new Date(),
        vulnerabilities: [],
        complianceStatus: 'compliant'
      }
    ];

    setHospitalSystems(systems);
  };

  const simulateNetworkActivity = () => {
    // Simulate network events for ML analysis
    const networkEvents = [
      {
        sourceIP: '10.100.50.25', // Medical device IP
        destinationIP: '10.0.1.100',
        packetSize: Math.random() * 2000 + 500,
        payload: Math.random() > 0.9 ? 'patient_data_export' : 'normal_traffic',
        timestamp: new Date(),
        protocol: 'TCP',
        bytesTransferred: Math.random() * 100000,
        packetsPerSecond: Math.random() * 100
      },
      {
        sourceIP: '192.168.200.15', // EHR system
        destinationIP: '10.0.2.50',
        packetSize: Math.random() * 1500 + 200,
        payload: Math.random() > 0.95 ? 'malware_signature' : 'ehr_data',
        timestamp: new Date(),
        protocol: 'HTTPS',
        bytesTransferred: Math.random() * 50000,
        packetsPerSecond: Math.random() * 50
      }
    ];

    networkEvents.forEach(event => {
      const classification = mlThreatDetector.classifyThreat(event);
      
      if (classification.severity === 'critical' || classification.severity === 'high') {
        // Generate medical device threat
        if (classification.threatType === 'medical_device_attack') {
          const threat: MedicalDeviceThreat = {
            id: `MDT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            deviceId: 'device-001',
            deviceName: 'Ventilator Network',
            deviceType: 'Life Support',
            threatType: 'unauthorized_access',
            severity: classification.severity,
            patientImpact: classification.patientSafety === 'critical' ? 'life_threatening' : 'medium',
            hipaaImpact: classification.hipaaImpact,
            detectedAt: new Date(),
            description: `ML-detected threat: ${classification.threatType} (${Math.round(classification.confidence * 100)}% confidence)`,
            mitigationSteps: classification.recommendations,
            affectedPatients: Math.floor(Math.random() * 10) + 1
          };
          
          setMedicalDeviceThreats(prev => [threat, ...prev.slice(0, 19)]);
        }

        // Generate patient data alert
        if (classification.hipaaImpact) {
          const alert: PatientDataAlert = {
            id: `PDA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            alertType: 'unauthorized_access',
            recordsAffected: Math.floor(Math.random() * 100) + 1,
            dataTypes: ['Demographics', 'Medical History', 'Lab Results'],
            accessedBy: event.sourceIP,
            accessLocation: 'Unknown External',
            timestamp: new Date(),
            riskLevel: classification.severity,
            hipaaNotificationRequired: classification.severity === 'critical'
          };
          
          setPatientDataAlerts(prev => [alert, ...prev.slice(0, 19)]);
        }

        // Generate compliance alert
        if (classification.hipaaImpact && Math.random() > 0.7) {
          const complianceAlert: ComplianceAlert = {
            id: `CA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            regulation: 'hipaa',
            violationType: 'Unauthorized PHI Access',
            severity: classification.severity,
            description: `Potential HIPAA violation detected: ${classification.threatType}`,
            affectedSystems: ['EHR System'],
            remediation: classification.recommendations,
            deadline: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
            status: 'open',
            createdAt: new Date()
          };
          
          setComplianceAlerts(prev => [complianceAlert, ...prev.slice(0, 19)]);
        }
      }
    });
  };

  const updateSecurityMetrics = () => {
    const criticalThreats = medicalDeviceThreats.filter(t => t.severity === 'critical').length;
    const highThreats = medicalDeviceThreats.filter(t => t.severity === 'high').length;
    const criticalSystems = hospitalSystems.filter(s => s.status === 'error' || s.status === 'offline').length;
    const openViolations = complianceAlerts.filter(a => a.status === 'open').length;
    const criticalPatientAlerts = patientDataAlerts.filter(a => a.riskLevel === 'critical').length;

    let threatLevel: SecurityMetrics['threatLevel'] = 'green';
    if (criticalThreats > 0 || criticalPatientAlerts > 0) threatLevel = 'red';
    else if (highThreats > 2 || criticalSystems > 1) threatLevel = 'orange';
    else if (highThreats > 0 || openViolations > 0) threatLevel = 'yellow';

    const complianceScore = Math.max(0, 100 - (openViolations * 5));
    const patientDataSecurity = Math.max(0, 100 - (criticalPatientAlerts * 10));

    setSecurityMetrics({
      threatLevel,
      activeThreats: criticalThreats + highThreats,
      criticalSystems,
      complianceScore,
      patientDataSecurity,
      lastAssessment: new Date()
    });
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const acknowledgeAlert = (alertId: string, type: 'compliance' | 'patient_data') => {
    if (type === 'compliance') {
      setComplianceAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'in_progress' as const } : alert
      ));
    } else {
      // Handle patient data alert acknowledgment
      console.log(`Acknowledged patient data alert: ${alertId}`);
    }
  };

  const resolveIncident = (incidentId: string) => {
    setMedicalDeviceThreats(prev => prev.filter(threat => threat.id !== incidentId));
  };

  return {
    hospitalSystems,
    medicalDeviceThreats,
    complianceAlerts,
    patientDataAlerts,
    securityMetrics,
    isMonitoring,
    toggleMonitoring,
    acknowledgeAlert,
    resolveIncident
  };
}