interface ThreatFeatures {
  packetSize: number;
  connectionDuration: number;
  bytesTransferred: number;
  packetsPerSecond: number;
  uniquePorts: number;
  protocolDiversity: number;
  payloadEntropy: number;
  suspiciousStrings: number;
  timeOfDay: number;
  dayOfWeek: number;
  sourceReputation: number;
  destinationReputation: number;
  geographicDistance: number;
  isEncrypted: boolean;
  hasBase64: boolean;
  isMedicalDevice: boolean;
  isPatientData: boolean;
  hipaaRelevant: boolean;
}

interface TrainingData {
  features: ThreatFeatures;
  label: 'benign' | 'malware' | 'intrusion' | 'ddos' | 'data_breach' | 'medical_device_attack';
  confidence: number;
}

class MLThreatDetector {
  private model: any = null;
  private trainingData: TrainingData[] = [];
  private isModelTrained = false;
  private featureWeights: Record<string, number> = {};
  private threatThresholds = {
    benign: 0.3,
    malware: 0.6,
    intrusion: 0.7,
    ddos: 0.8,
    data_breach: 0.9,
    medical_device_attack: 0.95
  };

  constructor() {
    this.initializeModel();
    this.loadTrainingData();
  }

  private initializeModel() {
    // Initialize Random Forest-like model using decision trees
    this.model = {
      trees: [],
      numTrees: 100,
      maxDepth: 10,
      minSamplesLeaf: 2
    };

    // Initialize feature weights (importance scores)
    this.featureWeights = {
      packetSize: 0.08,
      connectionDuration: 0.06,
      bytesTransferred: 0.12,
      packetsPerSecond: 0.15,
      uniquePorts: 0.09,
      protocolDiversity: 0.07,
      payloadEntropy: 0.11,
      suspiciousStrings: 0.13,
      timeOfDay: 0.03,
      dayOfWeek: 0.02,
      sourceReputation: 0.10,
      destinationReputation: 0.08,
      geographicDistance: 0.04,
      isEncrypted: 0.05,
      hasBase64: 0.06,
      isMedicalDevice: 0.18, // High weight for medical device context
      isPatientData: 0.20,   // Highest weight for patient data
      hipaaRelevant: 0.17    // High weight for HIPAA compliance
    };
  }

  private loadTrainingData() {
    // Load pre-defined training data for hospital environment
    this.trainingData = [
      // Benign traffic
      {
        features: {
          packetSize: 1024, connectionDuration: 2.5, bytesTransferred: 5000,
          packetsPerSecond: 10, uniquePorts: 2, protocolDiversity: 0.2,
          payloadEntropy: 4.2, suspiciousStrings: 0, timeOfDay: 14, dayOfWeek: 2,
          sourceReputation: 0.9, destinationReputation: 0.8, geographicDistance: 100,
          isEncrypted: true, hasBase64: false, isMedicalDevice: true,
          isPatientData: false, hipaaRelevant: false
        },
        label: 'benign',
        confidence: 0.95
      },
      // Medical device malware
      {
        features: {
          packetSize: 2048, connectionDuration: 0.1, bytesTransferred: 50000,
          packetsPerSecond: 200, uniquePorts: 15, protocolDiversity: 0.8,
          payloadEntropy: 7.8, suspiciousStrings: 5, timeOfDay: 3, dayOfWeek: 6,
          sourceReputation: 0.2, destinationReputation: 0.1, geographicDistance: 5000,
          isEncrypted: false, hasBase64: true, isMedicalDevice: true,
          isPatientData: false, hipaaRelevant: true
        },
        label: 'medical_device_attack',
        confidence: 0.92
      },
      // Patient data breach
      {
        features: {
          packetSize: 8192, connectionDuration: 30, bytesTransferred: 1000000,
          packetsPerSecond: 50, uniquePorts: 3, protocolDiversity: 0.3,
          payloadEntropy: 6.5, suspiciousStrings: 2, timeOfDay: 22, dayOfWeek: 0,
          sourceReputation: 0.4, destinationReputation: 0.3, geographicDistance: 8000,
          isEncrypted: true, hasBase64: false, isMedicalDevice: false,
          isPatientData: true, hipaaRelevant: true
        },
        label: 'data_breach',
        confidence: 0.88
      },
      // DDoS attack on hospital systems
      {
        features: {
          packetSize: 64, connectionDuration: 0.01, bytesTransferred: 100,
          packetsPerSecond: 10000, uniquePorts: 1, protocolDiversity: 0.1,
          payloadEntropy: 2.1, suspiciousStrings: 0, timeOfDay: 15, dayOfWeek: 3,
          sourceReputation: 0.1, destinationReputation: 0.9, geographicDistance: 12000,
          isEncrypted: false, hasBase64: false, isMedicalDevice: false,
          isPatientData: false, hipaaRelevant: false
        },
        label: 'ddos',
        confidence: 0.96
      }
    ];

    this.trainModel();
  }

  private trainModel() {
    if (this.trainingData.length < 10) {
      console.warn('Insufficient training data for ML model');
      return;
    }

    // Simulate Random Forest training
    this.model.trees = [];
    
    for (let i = 0; i < this.model.numTrees; i++) {
      const tree = this.buildDecisionTree(this.trainingData);
      this.model.trees.push(tree);
    }

    this.isModelTrained = true;
    console.log(`ML model trained with ${this.trainingData.length} samples and ${this.model.numTrees} trees`);
  }

  private buildDecisionTree(data: TrainingData[]): any {
    // Simplified decision tree implementation
    return {
      feature: 'isMedicalDevice',
      threshold: 0.5,
      left: { prediction: 'benign', confidence: 0.8 },
      right: { prediction: 'medical_device_attack', confidence: 0.7 }
    };
  }

  extractFeatures(networkEvent: any): ThreatFeatures {
    const payload = networkEvent.payload || '';
    const timestamp = new Date(networkEvent.timestamp || Date.now());

    return {
      packetSize: networkEvent.packetSize || 0,
      connectionDuration: networkEvent.connectionDuration || 0,
      bytesTransferred: networkEvent.bytesTransferred || 0,
      packetsPerSecond: networkEvent.packetsPerSecond || 0,
      uniquePorts: networkEvent.uniquePorts || 1,
      protocolDiversity: networkEvent.protocolDiversity || 0,
      payloadEntropy: this.calculateEntropy(payload),
      suspiciousStrings: this.countSuspiciousStrings(payload),
      timeOfDay: timestamp.getHours(),
      dayOfWeek: timestamp.getDay(),
      sourceReputation: networkEvent.sourceReputation || 0.5,
      destinationReputation: networkEvent.destinationReputation || 0.5,
      geographicDistance: networkEvent.geographicDistance || 0,
      isEncrypted: this.detectEncryption(payload),
      hasBase64: this.detectBase64(payload),
      isMedicalDevice: this.isMedicalDeviceIP(networkEvent.sourceIP),
      isPatientData: this.containsPatientData(payload),
      hipaaRelevant: this.isHIPAARelevant(networkEvent)
    };
  }

  private calculateEntropy(data: string): number {
    if (!data) return 0;
    
    const freq: Record<string, number> = {};
    for (const char of data) {
      freq[char] = (freq[char] || 0) + 1;
    }

    let entropy = 0;
    const length = data.length;
    
    for (const count of Object.values(freq)) {
      const probability = count / length;
      if (probability > 0) {
        entropy -= probability * Math.log2(probability);
      }
    }

    return entropy;
  }

  private countSuspiciousStrings(payload: string): number {
    const suspiciousPatterns = [
      'eval', 'exec', 'system', 'shell', 'cmd', 'script',
      'union', 'select', 'drop', 'insert', 'update', 'delete',
      'patient', 'medical', 'phi', 'ssn', 'dob', 'mrn',
      'trojan', 'backdoor', 'malware', 'virus', 'ransomware',
      'encrypt', 'decrypt', 'bitcoin', 'ransom'
    ];

    let count = 0;
    const lowerPayload = payload.toLowerCase();
    
    for (const pattern of suspiciousPatterns) {
      const matches = (lowerPayload.match(new RegExp(pattern, 'g')) || []).length;
      count += matches;
    }

    return count;
  }

  private detectEncryption(payload: string): boolean {
    const entropy = this.calculateEntropy(payload);
    return entropy > 7.0; // High entropy suggests encryption
  }

  private detectBase64(payload: string): boolean {
    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Pattern.test(payload) && payload.length > 20;
  }

  private isMedicalDeviceIP(ip: string): boolean {
    // Common medical device IP ranges in hospitals
    const medicalDeviceRanges = [
      '10.100.', '10.200.', '172.20.', '172.21.',
      '192.168.100.', '192.168.200.'
    ];
    
    return medicalDeviceRanges.some(range => ip?.startsWith(range));
  }

  private containsPatientData(payload: string): boolean {
    const patientDataPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
      /\b\d{2}\/\d{2}\/\d{4}\b/, // Date pattern
      /\bmrn\s*[:=]\s*\d+/i, // Medical Record Number
      /\bpatient\s+id\s*[:=]\s*\d+/i,
      /\bdob\s*[:=]/i, // Date of Birth
      /\bphi\b/i // Protected Health Information
    ];

    return patientDataPatterns.some(pattern => pattern.test(payload));
  }

  private isHIPAARelevant(networkEvent: any): boolean {
    return this.containsPatientData(networkEvent.payload || '') ||
           this.isMedicalDeviceIP(networkEvent.sourceIP) ||
           this.isMedicalDeviceIP(networkEvent.destinationIP);
  }

  classifyThreat(networkEvent: any): {
    threatType: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    hipaaImpact: boolean;
    patientSafety: 'safe' | 'concern' | 'risk' | 'critical';
    recommendations: string[];
  } {
    if (!this.isModelTrained) {
      return this.fallbackClassification(networkEvent);
    }

    const features = this.extractFeatures(networkEvent);
    
    // Simulate Random Forest prediction
    const predictions = this.model.trees.map((tree: any) => this.predictWithTree(tree, features));
    const threatCounts: Record<string, number> = {};
    
    predictions.forEach(pred => {
      threatCounts[pred] = (threatCounts[pred] || 0) + 1;
    });

    const mostCommonThreat = Object.entries(threatCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    const threatType = mostCommonThreat[0];
    const confidence = mostCommonThreat[1] / predictions.length;

    // Calculate risk score based on features and hospital context
    let riskScore = this.calculateRiskScore(features, threatType);
    
    // Adjust for hospital-specific factors
    if (features.isMedicalDevice) riskScore += 20;
    if (features.isPatientData) riskScore += 30;
    if (features.hipaaRelevant) riskScore += 25;

    riskScore = Math.min(100, riskScore);

    const severity = this.determineSeverity(riskScore, features);
    const patientSafety = this.assessPatientSafety(features, threatType);
    const recommendations = this.generateRecommendations(threatType, features);

    return {
      threatType,
      confidence,
      severity,
      riskScore,
      hipaaImpact: features.hipaaRelevant,
      patientSafety,
      recommendations
    };
  }

  private predictWithTree(tree: any, features: ThreatFeatures): string {
    // Simplified tree traversal
    if (features.isMedicalDevice && features.suspiciousStrings > 2) {
      return 'medical_device_attack';
    }
    if (features.isPatientData && features.bytesTransferred > 100000) {
      return 'data_breach';
    }
    if (features.packetsPerSecond > 1000) {
      return 'ddos';
    }
    if (features.payloadEntropy > 7.5) {
      return 'malware';
    }
    if (features.suspiciousStrings > 5) {
      return 'intrusion';
    }
    return 'benign';
  }

  private calculateRiskScore(features: ThreatFeatures, threatType: string): number {
    let score = 0;

    // Base score from threat type
    const baseScores = {
      benign: 10,
      malware: 60,
      intrusion: 70,
      ddos: 65,
      data_breach: 85,
      medical_device_attack: 90
    };

    score = baseScores[threatType as keyof typeof baseScores] || 50;

    // Adjust based on features
    if (features.suspiciousStrings > 3) score += 15;
    if (features.payloadEntropy > 7.0) score += 10;
    if (features.packetsPerSecond > 500) score += 12;
    if (features.sourceReputation < 0.3) score += 20;
    if (features.bytesTransferred > 1000000) score += 15;

    return Math.min(100, score);
  }

  private determineSeverity(riskScore: number, features: ThreatFeatures): 'low' | 'medium' | 'high' | 'critical' {
    // Hospital-specific severity determination
    if (features.isMedicalDevice && riskScore > 60) return 'critical';
    if (features.isPatientData && riskScore > 50) return 'critical';
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 40) return 'medium';
    return 'low';
  }

  private assessPatientSafety(features: ThreatFeatures, threatType: string): 'safe' | 'concern' | 'risk' | 'critical' {
    if (threatType === 'medical_device_attack') return 'critical';
    if (features.isMedicalDevice && threatType !== 'benign') return 'risk';
    if (features.isPatientData) return 'concern';
    return 'safe';
  }

  private generateRecommendations(threatType: string, features: ThreatFeatures): string[] {
    const recommendations: string[] = [];

    switch (threatType) {
      case 'medical_device_attack':
        recommendations.push('Immediately isolate affected medical device');
        recommendations.push('Notify biomedical engineering team');
        recommendations.push('Check patient safety protocols');
        recommendations.push('Review device firmware and security patches');
        break;
      
      case 'data_breach':
        recommendations.push('Activate HIPAA breach response protocol');
        recommendations.push('Identify and secure affected patient records');
        recommendations.push('Notify privacy officer and legal team');
        recommendations.push('Prepare breach notification documentation');
        break;
      
      case 'ddos':
        recommendations.push('Activate DDoS mitigation protocols');
        recommendations.push('Ensure critical systems remain accessible');
        recommendations.push('Monitor patient care system availability');
        break;
      
      case 'malware':
        recommendations.push('Isolate infected systems immediately');
        recommendations.push('Run comprehensive malware scan');
        recommendations.push('Check for lateral movement to medical devices');
        break;
      
      case 'intrusion':
        recommendations.push('Change all administrative passwords');
        recommendations.push('Review access logs for unauthorized activity');
        recommendations.push('Audit user permissions and access controls');
        break;
    }

    // Add hospital-specific recommendations
    if (features.isMedicalDevice) {
      recommendations.push('Coordinate with clinical staff for device safety');
    }
    if (features.isPatientData) {
      recommendations.push('Document incident for HIPAA compliance');
    }

    return recommendations;
  }

  private fallbackClassification(networkEvent: any) {
    const features = this.extractFeatures(networkEvent);
    
    // Rule-based fallback for hospital environment
    if (features.isMedicalDevice && features.suspiciousStrings > 0) {
      return {
        threatType: 'medical_device_attack',
        confidence: 0.7,
        severity: 'critical' as const,
        riskScore: 85,
        hipaaImpact: true,
        patientSafety: 'critical' as const,
        recommendations: ['Isolate medical device immediately', 'Notify clinical staff']
      };
    }

    if (features.isPatientData) {
      return {
        threatType: 'data_breach',
        confidence: 0.6,
        severity: 'high' as const,
        riskScore: 75,
        hipaaImpact: true,
        patientSafety: 'concern' as const,
        recommendations: ['Activate HIPAA breach protocol', 'Secure patient data']
      };
    }

    return {
      threatType: 'benign',
      confidence: 0.5,
      severity: 'low' as const,
      riskScore: 20,
      hipaaImpact: false,
      patientSafety: 'safe' as const,
      recommendations: ['Continue monitoring']
    };
  }

  addTrainingData(features: ThreatFeatures, label: TrainingData['label'], confidence: number) {
    this.trainingData.push({ features, label, confidence });
    
    // Retrain model if we have enough new data
    if (this.trainingData.length % 50 === 0) {
      this.trainModel();
    }
  }

  getModelMetrics() {
    return {
      isModelTrained: this.isModelTrained,
      trainingDataSize: this.trainingData.length,
      numTrees: this.model.numTrees,
      featureWeights: this.featureWeights,
      threatThresholds: this.threatThresholds
    };
  }

  exportModel(): string {
    return JSON.stringify({
      model: this.model,
      trainingData: this.trainingData,
      featureWeights: this.featureWeights,
      isModelTrained: this.isModelTrained,
      exportedAt: new Date().toISOString()
    });
  }

  importModel(modelData: string): boolean {
    try {
      const data = JSON.parse(modelData);
      this.model = data.model;
      this.trainingData = data.trainingData;
      this.featureWeights = data.featureWeights;
      this.isModelTrained = data.isModelTrained;
      console.log('ML model imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import ML model:', error);
      return false;
    }
  }
}

export const mlThreatDetector = new MLThreatDetector();