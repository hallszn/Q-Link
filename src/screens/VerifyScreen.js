import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import VerificationCamera from '../components/VerificationCamera';

export default function VerifyScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const handleScanComplete = (result) => {
    setShowCamera(false);
    setVerificationStatus(result.verified ? 'verified' : 'failed');
  };

  const handleCancel = () => {
    setShowCamera(false);
  };

  if (showCamera) {
    return (
      <VerificationCamera
        onScanComplete={handleScanComplete}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Status indicator */}
      {verificationStatus && (
        <View
          style={[
            styles.statusBadge,
            verificationStatus === 'verified'
              ? styles.statusVerified
              : styles.statusFailed,
          ]}
        >
          <Text style={styles.statusBadgeText}>
            {verificationStatus === 'verified'
              ? '✓ Identity Verified'
              : '✗ Verification Failed'}
          </Text>
        </View>
      )}

      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔐</Text>
      </View>

      <Text style={styles.title}>Verify</Text>
      <Text style={styles.subtitle}>Prove you're human</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Why verify?</Text>
        <Text style={styles.infoText}>
          Q-Link uses biometric verification to ensure every connection is with
          a real, verified human. Your data stays on-device and is never stored.
        </Text>
      </View>

      <View style={styles.steps}>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Position your face in frame</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Complete the scan</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Receive your verification badge</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowCamera(true)}
      >
        <Text style={styles.buttonText}>
          {verificationStatus === 'verified'
            ? 'Re-verify'
            : 'Start Verification'}
        </Text>
      </TouchableOpacity>

      {verificationStatus === 'failed' && (
        <Text style={styles.errorHint}>
          Please try again in good lighting with your face clearly visible.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  statusBadge: {
    position: 'absolute',
    top: 60,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusVerified: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  statusFailed: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  subtitle: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 8,
  },
  infoBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    width: '100%',
  },
  infoTitle: {
    color: '#00f5ff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#8892b0',
    fontSize: 13,
    lineHeight: 20,
  },
  steps: {
    marginTop: 30,
    width: '100%',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00ff88',
    color: '#0a0a0f',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    color: '#ffffff',
    fontSize: 14,
  },
  button: {
    marginTop: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#00ff88',
    borderRadius: 25,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#0a0a0f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorHint: {
    marginTop: 16,
    color: '#ff4444',
    fontSize: 12,
    textAlign: 'center',
  },
});
