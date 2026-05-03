import React from 'react';
import { Tabs, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  const segments = useSegments();
  const isOnHotelDetail = segments.includes('hotel-detail');

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#3AADBE',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 8,
        paddingTop: 8,
        height: 60,
      },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home',
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />

      <Tabs.Screen name="search" options={{ title: 'Search',
        tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }} />

      <Tabs.Screen name="chat" options={{ title: 'Chat',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubble" size={size} color={isOnHotelDetail ? '#3AADBE' : color} />
        ),
        tabBarLabelStyle: isOnHotelDetail ? { color: '#3AADBE' } : {},
      }} />

      <Tabs.Screen name="profile" options={{ title: 'Profile',
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}