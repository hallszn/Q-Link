import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BusinessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business</Text>
      <Text style={styles.subtitle}>Your entrepreneurial facet</Text>
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
    color: '#ffaa00',
  },
  subtitle: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 8,
  },
});
