import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Q-Link</Text>
      <Text style={styles.subtitle}>Verified Humans Only</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✓ VERIFIED HUMAN</Text>
      </View>
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00f5ff',
    textShadowColor: '#00f5ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
    marginTop: 8,
    letterSpacing: 2,
  },
  badge: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#00ff88',
    borderRadius: 20,
  },
  badgeText: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
