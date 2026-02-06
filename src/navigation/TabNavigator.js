import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ProfessionalScreen from '../screens/ProfessionalScreen';
import SocialScreen from '../screens/SocialScreen';
import BusinessScreen from '../screens/BusinessScreen';
import VerifyScreen from '../screens/VerifyScreen';

const Tab = createBottomTabNavigator();

// Simple icon component
const TabIcon = ({ label, color }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.icon, { color }]}>
      {label === 'Home' && '⬡'}
      {label === 'Professional' && '💼'}
      {label === 'Social' && '👥'}
      {label === 'Business' && '📈'}
      {label === 'Verify' && '✓'}
    </Text>
  </View>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#00f5ff',
        tabBarInactiveTintColor: '#4a5568',
        tabBarIcon: ({ color }) => <TabIcon label={route.name} color={color} />,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Professional" component={ProfessionalScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Business" component={BusinessScreen} />
      <Tab.Screen name="Verify" component={VerifyScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0a0a0f',
    borderTopColor: '#1a1a2e',
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
});
