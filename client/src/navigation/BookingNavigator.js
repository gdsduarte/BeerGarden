import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BookingsScreen, BookingDetailsScreen} from '../screens';

const Stack = createStackNavigator();

const BookingNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Bookings" component={BookingsScreen} />
      <Stack.Screen
        name="BookingDetailsScreen"
        component={BookingDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default BookingNavigator;
