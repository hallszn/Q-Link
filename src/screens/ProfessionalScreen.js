import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfessionalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professional</Text>
      <Text style={styles.subtitle}>Your work identity</Text>
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
    color: '#00f5ff',
  },
  subtitle: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 8,
  },
});
