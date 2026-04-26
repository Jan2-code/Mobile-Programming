import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import HomeScreen from './HomeScreen';
import AddDonationScreen from './AddDonationScreen';
import DonationDetailScreen from './DonationDetailScreen';
import ProfileScreen from './ProfileScreen';
import { COLORS, FONTS, SPACING, SHADOWS, RADIUS } from './responsive';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icon component
const TabIcon = ({ name, focused, label }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={22}
      color={focused ? COLORS.primary : COLORS.textLight}
    />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon name="home" focused={focused} label="Home" />
        ),
      }}
    />
    <Tab.Screen
      name="AddDonation"
      component={AddDonationScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={styles.addBtn}>
            <Ionicons name="add" size={28} color={COLORS.surface} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon name="person" focused={focused} label="Profile" />
        ),
      }}
    />
  </Tab.Navigator>
);

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// App Stack (authenticated)
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen
      name="DonationDetail"
      component={DonationDetailScreen}
      options={{ presentation: 'card' }}
    />
  </Stack.Navigator>
);

// Root Navigator
const AppNavigator = ({ user }) => {
  return user ? <AppStack /> : <AuthStack />;
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 84 : 68,
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...SHADOWS.large,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    gap: 2,
  },
  tabIconActive: {
    backgroundColor: COLORS.surfaceAlt,
  },
  tabLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 8 : 12,
    ...SHADOWS.medium,
  },
});

export default AppNavigator;