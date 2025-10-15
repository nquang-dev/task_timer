// App.js - Entry point với Bottom Tab Navigation
// Phase 1: Setup navigation cơ bản với 2 tabs

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TimerScreen from './screens/TimerScreen';
import HistoryScreen from './screens/HistoryScreen';

// Tạo Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#1976D2', // Màu xanh khi active
          tabBarInactiveTintColor: '#9E9E9E', // Màu xám khi inactive
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#1976D2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Tab 1: Timer Screen */}
        <Tab.Screen 
          name="Timer" 
          component={TimerScreen}
          options={{
            tabBarLabel: 'Timer',
            headerTitle: 'Pomodoro Timer',
            // Phase sau sẽ thêm icon với tabBarIcon
          }}
        />
        
        {/* Tab 2: History Screen */}
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{
            tabBarLabel: 'History',
            headerTitle: 'Session History',
            // Phase sau sẽ thêm icon với tabBarIcon
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
