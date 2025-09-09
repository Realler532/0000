import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Mail, Key, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode';

interface MFASetupProps {
  userId: string;
  userEmail: string;
  onMFAEnabled: () => void;
}

export function MFASetup({ userId, userEmail, onMFAEnabled }: MFASetupProps) {
  const [step, setStep] = useState(1);
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'sms' | 'email'>('totp');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 2 && mfaMethod === 'totp') {
      generateTOTPSecret();
    }
  }, [step, mfaMethod]);

  const generateTOTPSecret = async () => {
    // Generate a random secret for TOTP
    const newSecret = Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(36))
      .join('')
      .substring(0, 32)
      .toUpperCase();
    
    setSecret(newSecret);

    // Generate QR code
    const otpAuthUrl = `otpauth://totp/Hospital%20SOC:${encodeURIComponent(userEmail)}?secret=${newSecret}&issuer=Hospital%20SOC`;
    
    try {
      const qrUrl = await QRCode.toDataURL(otpAuthUrl);
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code');
    }

    // Generate backup codes
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    setError('');

    // Simulate verification (in real implementation, verify against TOTP algorithm)
    setTimeout(() => {
      if (verificationCode.length === 6) {
        setStep(3);
        setIsVerifying(false);
      } else {
        setError('Invalid verification code. Please try again.');
        setIsVerifying(false);
      }
    }, 1000);
  };

  const handleCompleteMFA = () => {
    // In real implementation, save MFA configuration to database
    console.log('MFA setup completed for user:', userId);
    onMFAEnabled();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAllBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Multi-Factor Authentication Setup
        </h2>
        <p className="text-gray-400">
          Enhance your account security with MFA
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white text-center">Choose MFA Method</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setMfaMethod('totp')}
              className={`w-full p-4 rounded-lg border transition-colors text-left ${
                mfaMethod === 'totp'
                  ? 'bg-blue-900/30 border-blue-700/50 text-blue-300'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6" />
                <div>
                  <div className="font-medium">Authenticator App (Recommended)</div>
                  <div className="text-sm opacity-75">Use Google Authenticator, Authy, or similar</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMfaMethod('email')}
              className={`w-full p-4 rounded-lg border transition-colors text-left ${
                mfaMethod === 'email'
                  ? 'bg-blue-900/30 border-blue-700/50 text-blue-300'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6" />
                <div>
                  <div className="font-medium">Email Verification</div>
                  <div className="text-sm opacity-75">Receive codes via email</div>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && mfaMethod === 'totp' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white text-center">Scan QR Code</h3>
          
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />}
            </div>
            
            <p className="text-gray-400 text-sm mb-4">
              Scan this QR code with your authenticator app
            </p>
            
            <div className="bg-gray-900 rounded-lg p-3 mb-4">
              <div className="text-gray-400 text-xs mb-1">Manual Entry Key:</div>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-white font-mono text-sm">{secret}</code>
                <button
                  onClick={() => copyToClipboard(secret)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter verification code from your app:
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-lg font-mono focus:outline-none focus:border-blue-500"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleVerifyCode}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">MFA Setup Complete!</h3>
            <p className="text-gray-400">Your account is now protected with multi-factor authentication</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
            <h4 className="text-yellow-300 font-medium mb-3 flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Backup Recovery Codes
            </h4>
            <p className="text-yellow-200 text-sm mb-3">
              Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
            </p>
            
            <div className="bg-gray-900 rounded-lg p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                {backupCodes.map((code, index) => (
                  <div key={index} className="text-white font-mono text-sm py-1">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={copyAllBackupCodes}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy All Backup Codes</span>
            </button>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">Important Security Notes:</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Keep your authenticator device secure</li>
              <li>• Store backup codes in a safe location</li>
              <li>• Never share your MFA codes with anyone</li>
              <li>• Contact IT if you lose access to your authenticator</li>
            </ul>
          </div>

          <button
            onClick={handleCompleteMFA}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Complete MFA Setup
          </button>
        </div>
      )}
    </div>
  );
}