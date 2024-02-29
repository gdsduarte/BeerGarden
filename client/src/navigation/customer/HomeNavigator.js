import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  HomeScreen,
  ReservationScreen,
  ReservationDetailsScreen,
  SearchScreen,
} from '../../screens';

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReservationScreen"
        component={ReservationScreen}
        options={{title: 'Bookings'}}
      />
      <Stack.Screen
        name="ReservationDetailsScreen"
        component={ReservationDetailsScreen}
        options={{title: 'Reservation Details'}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{title: 'Search'}}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
