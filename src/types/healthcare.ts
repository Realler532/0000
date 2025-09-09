export interface HospitalSystem {
  id: string;
  name: string;
  type: 'ehr' | 'pacs' | 'his' | 'lis' | 'pharmacy' | 'medical_device' | 'network' | 'security';
  criticality: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  department: string;
  status: 'online' | 'offline' | 'warning' | 'error' | 'maintenance';
  lastHealthCheck: Date;
  vulnerabilities: string[];
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
}

export interface MedicalDeviceThreat {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  threatType: 'unauthorized_access' | 'malware' | 'data_breach' | 'device_tampering' | 'network_intrusion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  patientImpact: 'none' | 'low' | 'medium' | 'high' | 'life_threatening';
  hipaaImpact: boolean;
  detectedAt: Date;
  description: string;
  mitigationSteps: string[];
  affectedPatients?: number;
}

export interface ComplianceAlert {
  id: string;
  regulation: 'hipaa' | 'hitech' | 'fda' | 'joint_commission' | 'cms';
  violationType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedSystems: string[];
  remediation: string[];
  deadline?: Date;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
}

export interface PatientDataAlert {
  id: string;
  alertType: 'unauthorized_access' | 'data_export' | 'phi_exposure' | 'audit_failure';
  patientId?: string;
  recordsAffected: number;
  dataTypes: string[];
  accessedBy?: string;
  accessLocation: string;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  hipaaNotificationRequired: boolean;
}

export interface MFAConfig {
  enabled: boolean;
  method: 'totp' | 'sms' | 'email';
  backupCodes: string[];
  lastUsed?: Date;
}

export interface SecurityMetrics {
  threatLevel: 'green' | 'yellow' | 'orange' | 'red';
  activeThreats: number;
  criticalSystems: number;
  complianceScore: number;
  patientDataSecurity: number;
  lastAssessment: Date;
}