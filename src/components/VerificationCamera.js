import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

export default function VerificationCamera({ onScanComplete, onCancel }) {
  const [scanPhase, setScanPhase] = useState('ready'); // ready, scanning, complete
  const [scanProgress, setScanProgress] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [scanLineAnim] = useState(new Animated.Value(0));

  // Pulsing animation for the face outline
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Scanning line animation
  useEffect(() => {
    if (scanPhase === 'scanning') {
      const scanLine = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      scanLine.start();
      return () => scanLine.stop();
    }
  }, [scanPhase]);

  // Mock scan progress
  useEffect(() => {
    if (scanPhase === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanPhase('complete');
            setTimeout(() => {
              if (onScanComplete) onScanComplete({ verified: true });
            }, 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [scanPhase]);

  const startScan = () => {
    setScanPhase('scanning');
    setScanProgress(0);
  };

  const getStatusText = () => {
    switch (scanPhase) {
      case 'ready':
        return 'Position your face in the frame';
      case 'scanning':
        return `Scanning... ${scanProgress}%`;
      case 'complete':
        return '✓ Verification Complete';
      default:
        return '';
    }
  };

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      {/* Mock camera view (dark placeholder) */}
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.cameraPlaceholderText}>📷</Text>
        <Text style={styles.cameraSubtext}>Camera Preview</Text>
        <Text style={styles.cameraMockNote}>(WebRTC integration pending)</Text>
      </View>

      {/* Face outline overlay */}
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.faceOutline,
            { transform: [{ scale: pulseAnim }] },
            scanPhase === 'complete' && styles.faceOutlineComplete,
          ]}
        >
          {/* Scanning line */}
          {scanPhase === 'scanning' && (
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: scanLineTranslate }] },
              ]}
            />
          )}
        </Animated.View>

        {/* Corner markers */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      {/* Status and controls */}
      <View style={styles.controls}>
        <Text style={styles.statusText}>{getStatusText()}</Text>

        {scanPhase === 'scanning' && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${scanProgress}%` }]} />
          </View>
        )}

        {scanPhase === 'ready' && (
          <TouchableOpacity style={styles.startButton} onPress={startScan}>
            <Text style={styles.startButtonText}>Start Scan</Text>
          </TouchableOpacity>
        )}

        {scanPhase !== 'scanning' && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#0d0d12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPlaceholderText: {
    fontSize: 60,
    marginBottom: 10,
  },
  cameraSubtext: {
    color: '#4a5568',
    fontSize: 16,
  },
  cameraMockNote: {
    color: '#2a2a4e',
    fontSize: 12,
    marginTop: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOutline: {
    width: 200,
    height: 250,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#00f5ff',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  faceOutlineComplete: {
    borderColor: '#00ff88',
    borderStyle: 'solid',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff88',
  },
  cornerTL: {
    top: '25%',
    left: '20%',
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: '25%',
    right: '20%',
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: '35%',
    left: '20%',
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: '35%',
    right: '20%',
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    backgroundColor: 'rgba(10, 10, 15, 0.9)',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
  },
  startButton: {
    backgroundColor: '#00ff88',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: '#0a0a0f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8892b0',
    fontSize: 16,
  },
});
