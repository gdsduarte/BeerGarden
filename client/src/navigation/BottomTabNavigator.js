import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faComments, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatNavigator from './ChatNavigator';
import BookingNavigator from './BookingNavigator';
import SearchNavigator from './SearchNavigator';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Home') {
            icon = faHome;
          } else if (route.name === 'Search') {
            icon = faSearch;
          } else if (route.name === 'Chat') {
            icon = faComments;
          } else if (route.name === 'Booking') {
            icon = faCalendarAlt;
          } else if (route.name === 'Profile') {
            icon = faUser;
          }

          return (
            <FontAwesomeIcon
              icon={icon}
              size={focused ? size + 3 : size}
              color={focused ? '#8B4513' : '#5c5c5c'}
            />
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ color: focused ? '#8B4513' : '#5c5c5c' }}>
            {route.name}
          </Text>
        ),
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 80 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchNavigator} />
      <Tab.Screen name="Chat" component={ChatNavigator} />
      <Tab.Screen name="Booking" component={BookingNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
