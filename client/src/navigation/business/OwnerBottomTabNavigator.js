import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, Platform, Keyboard} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCalendarAlt,
  faTableColumns,
  faComments,
  faUtensils,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import {ProfileNavigator, PubChatNavigator, PubBookingNavigator} from '..';
import {DashboardScreen} from '@screens';
import MenuScreenTab from '../../navigation/business/MenuScreenTab';

const Tab = createBottomTabNavigator();

const OwnerBottomTabNavigator = () => {
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
          if (route.name === 'Dashboard') {
            icon = faTableColumns;
          } else if (route.name === 'Bookings') {
            icon = faCalendarAlt;
          } else if (route.name === 'Chat') {
            icon = faComments;
          } else if (route.name === 'Menu') {
            icon = faUtensils;
          } else if (route.name === 'More') {
            icon = faEllipsis;
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
        //headerShown: false,
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Menu" component={MenuScreenTab} />
      <Tab.Screen
        name="Bookings"
        component={PubBookingNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Chat"
        component={PubChatNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen name="More" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default OwnerBottomTabNavigator;
