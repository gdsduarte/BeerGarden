import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ReservationScreen,
  ReservationDetailsScreen,
  SpecificChatScreen,
  BookingScreen,
  BookingInputScreen,
} from '../../screens';

const Stack = createStackNavigator();

const BookingNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReservationScreen"
        component={ReservationScreen}
        options={{title: 'Bookings'}}
      />
      <Stack.Screen
        name="ReservationDetailsScreen"
        component={ReservationDetailsScreen}
        options={{title: 'Booking Details'}}
      />
      <Stack.Screen 
        name="SpecificChatScreen" 
        component={SpecificChatScreen}
      />
      <Stack.Screen 
        name="BookingScreen" 
        component={BookingScreen}
        options={{title: 'Update Booking'}}
      />
      <Stack.Screen 
        name="BookingInputScreen" 
        component={BookingInputScreen}
        options={{title: 'Update Booking'}}
      />
    </Stack.Navigator>
  );
};

export default BookingNavigator;
