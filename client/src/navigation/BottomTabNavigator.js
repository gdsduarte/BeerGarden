import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';;
import ProfileScreen from '../screens/ProfileScreen';
import ChatNavigator from './ChatNavigator';
import BookingNavigator from './BookingNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen name="Dashboard" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Chat" component={ChatNavigator} />
    <Tab.Screen name="Bookings" component={BookingNavigator} />
    <Tab.Screen name="Profile" component={ProfileScreen}/>
  </Tab.Navigator>
);

export default BottomTabNavigator;
