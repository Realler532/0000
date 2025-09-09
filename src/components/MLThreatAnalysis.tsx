import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Activity, Download, Upload, Settings } from 'lucide-react';
import { mlThreatDetector } from '../services/mlThreatDetection';

export function MLThreatAnalysis() {
  const [modelMetrics, setModelMetrics] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string>('');

  useEffect(() => {
    loadModelMetrics();
    simulateAnalysis();
  }, []);

  const loadModelMetrics = () => {
    const metrics = mlThreatDetector.getModelMetrics();
    setModelMetrics(metrics);
  };

  const simulateAnalysis = () => {
    // Simulate real-time threat analysis
    const interval = setInterval(() => {
      const networkEvent = {
        sourceIP: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destinationIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        packetSize: Math.random() * 2000 + 100,
        payload: Math.random() > 0.8 ? 'suspicious_medical_data' : 'normal_traffic',
        timestamp: new Date(),
        bytesTransferred: Math.random() * 100000,
        packetsPerSecond: Math.random() * 200
      };

      const classification = mlThreatDetector.classifyThreat(networkEvent);
      
      if (classification.severity !== 'low') {
        setAnalysisResults(prev => [
          {
            id: Date.now(),
            timestamp: new Date(),
            sourceIP: networkEvent.sourceIP,
            classification,
            networkEvent
          },
          ...prev.slice(0, 19)
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const handleTrainModel = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsTraining(false);
          loadModelMetrics();
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleExportModel = () => {
    const modelData = mlThreatDetector.exportModel();
    const blob = new Blob([modelData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospital_ml_model_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportModel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (mlThreatDetector.importModel(content)) {
          loadModelMetrics();
          alert('Model imported successfully!');
        } else {
          alert('Failed to import model. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-900/30';
      case 'high':
        return 'text-orange-400 bg-orange-900/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'low':
        return 'text-blue-400 bg-blue-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getPatientSafetyColor = (safety: string) => {
    switch (safety) {
      case 'critical':
        return 'text-red-400';
      case 'risk':
        return 'text-orange-400';
      case 'concern':
        return 'text-yellow-400';
      case 'safe':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* ML Model Overview */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Brain className="h-6 w-6 text-purple-400 mr-2" />
            ML Threat Detection Engine
          </h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${modelMetrics?.isModelTrained ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
            <span className="text-sm text-gray-300">
              {modelMetrics?.isModelTrained ? 'Model Trained' : 'Training Required'}
            </span>
          </div>
        </div>

        {modelMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/50">
              <div className="text-purple-400 text-2xl font-bold">{modelMetrics.trainingDataSize}</div>
              <div className="text-gray-400 text-sm">Training Samples</div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
              <div className="text-blue-400 text-2xl font-bold">{modelMetrics.numTrees}</div>
              <div className="text-gray-400 text-sm">Decision Trees</div>
            </div>
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
              <div className="text-green-400 text-2xl font-bold">
                {Object.keys(modelMetrics.featureWeights || {}).length}
              </div>
              <div className="text-gray-400 text-sm">Features</div>
            </div>
            <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50">
              <div className="text-orange-400 text-2xl font-bold">
                {analysisResults.filter(r => r.classification.severity === 'critical').length}
              </div>
              <div className="text-gray-400 text-sm">Critical Detections</div>
            </div>
          </div>
        )}

        {/* Model Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>{isTraining ? 'Training...' : 'Retrain Model'}</span>
          </button>
          
          <button
            onClick={handleExportModel}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Model</span>
          </button>
          
          <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Import Model</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportModel}
              className="hidden"
            />
          </label>
        </div>

        {/* Training Progress */}
        {isTraining && (
          <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 text-sm">Training Progress</span>
              <span className="text-purple-300 text-sm">{trainingProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Importance */}
      {modelMetrics?.featureWeights && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-400 mr-2" />
            Feature Importance (Hospital-Specific)
          </h3>
          
          <div className="space-y-3">
            {Object.entries(modelMetrics.featureWeights)
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .slice(0, 10)
              .map(([feature, weight]) => (
                <div key={feature} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-white font-medium capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    {(feature === 'isMedicalDevice' || feature === 'isPatientData' || feature === 'hipaaRelevant') && (
                      <span className="text-xs px-2 py-1 bg-pink-900/50 text-pink-300 rounded">
                        Healthcare Critical
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(weight as number) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-sm w-12 text-right">
                      {((weight as number) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Real-time Analysis Results */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Activity className="h-5 w-5 text-green-400 mr-2" />
          Real-time ML Analysis Results
        </h3>
        
        {analysisResults.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No threats detected by ML analysis</p>
            <p className="text-gray-500 text-sm">System is monitoring network traffic</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analysisResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border ${getSeverityColor(result.classification.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-5 w-5 text-purple-400 mt-1" />
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">
                        ML Detection: {result.classification.threatType.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-gray-300 text-sm mt-1">
                        Source: {result.sourceIP} • Confidence: {Math.round(result.classification.confidence * 100)}%
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{result.timestamp.toLocaleTimeString()}</span>
                        <span>Risk Score: {result.classification.riskScore}</span>
                        <span className={`${getPatientSafetyColor(result.classification.patientSafety)}`}>
                          Patient Safety: {result.classification.patientSafety.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(result.classification.severity)}`}>
                      {result.classification.severity.toUpperCase()}
                    </span>
                    {result.classification.hipaaImpact && (
                      <div className="text-blue-300 text-xs mt-1">🔒 HIPAA Impact</div>
                    )}
                  </div>
                </div>
                
                {result.classification.recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">ML Recommendations:</p>
                    <div className="space-y-1">
                      {result.classification.recommendations.slice(0, 3).map((rec: string, index: number) => (
                        <div key={index} className="text-xs text-gray-300 flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Model Training Data */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Settings className="h-5 w-5 text-gray-400 mr-2" />
          Model Configuration & Training
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-semibold text-white mb-3">Training Data Categories</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300 text-sm">Benign Traffic</span>
                <span className="text-green-400 font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300 text-sm">Medical Device Attacks</span>
                <span className="text-red-400 font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300 text-sm">Data Breaches</span>
                <span className="text-orange-400 font-medium">15%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300 text-sm">DDoS Attacks</span>
                <span className="text-yellow-400 font-medium">10%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300 text-sm">Other Threats</span>
                <span className="text-blue-400 font-medium">5%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-white mb-3">Hospital-Specific Features</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-pink-900/20 rounded border border-pink-700/50">
                <span className="text-pink-300 text-sm">Medical Device Detection</span>
                <span className="text-pink-400 font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded border border-blue-700/50">
                <span className="text-blue-300 text-sm">Patient Data Classification</span>
                <span className="text-blue-400 font-medium">20%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-900/20 rounded border border-purple-700/50">
                <span className="text-purple-300 text-sm">HIPAA Relevance</span>
                <span className="text-purple-400 font-medium">17%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300 text-sm">Network Behavior</span>
                <span className="text-gray-400 font-medium">45%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">
            The ML model is specifically trained for hospital environments with emphasis on:
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Medical device communication patterns</li>
            <li>• Patient data access behaviors</li>
            <li>• HIPAA compliance requirements</li>
            <li>• Healthcare-specific threat vectors</li>
            <li>• Clinical workflow protection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}