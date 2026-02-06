import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function VerifyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify</Text>
      <Text style={styles.subtitle}>Prove you're human</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start Verification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
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
  button: {
    marginTop: 40,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#00ff88',
    borderRadius: 25,
  },
  buttonText: {
    color: '#0a0a0f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
