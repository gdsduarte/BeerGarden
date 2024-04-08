/**
 * BottomTabNavigator component is used to navigate between Home, Search, Chat, Booking and Profile screens.
 * This is the main navigation for the customer side of the application.
 */

import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, Platform, Keyboard} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faSearch,
  faComments,
  faCalendarAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  BookingNavigator,
  SearchNavigator,
  ChatNavigator,
  ProfileNavigator,
  HomeNavigator,
} from '@navigation';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
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
        tabBarLabel: ({focused, color}) => (
          <Text style={{color: focused ? '#8B4513' : '#5c5c5c'}}>
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
          display: keyboardVisible ? 'none' : 'flex',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        keyboardHidesTabBar: true,
      })}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Search" component={SearchNavigator} />
      <Tab.Screen name="Chat" component={ChatNavigator} />
      <Tab.Screen name="Booking" component={BookingNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
