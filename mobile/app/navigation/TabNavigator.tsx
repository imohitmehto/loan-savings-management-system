import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import AboutUs from '../screens/AboutUs';
import Account from '../screens/Account';
import Profile from '../screens/Profile';
import ApplyLoan from '../screens/ApplyLoan';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="About Us" component={AboutUs} />
      <Tab.Screen name="Account" component={Account} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Apply Loan" component={ApplyLoan} />
    </Tab.Navigator>
  );
}
