


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TimerScreen from './screens/TimerScreen';
import HistoryScreen from './screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#1976D2', 
          tabBarInactiveTintColor: '#9E9E9E', 
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
        <Tab.Screen 
          name="Timer" 
          component={TimerScreen}
          options={{
            tabBarLabel: 'Timer',
            headerTitle: 'Pomodoro Timer',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="timer-outline" size={size} color={color} />
            ),
          }}
        />
        
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{
            tabBarLabel: 'History',
            headerTitle: 'Session History',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
