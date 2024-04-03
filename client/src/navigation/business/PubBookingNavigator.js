import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  PubReservationScreen,
  PubReservationDetailsScreen,
  SpecificChatScreen,
  BookingScreen,
  BookingInputScreen,
} from '@screens';

const Stack = createStackNavigator();

const PubBookingNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PubReservationScreen"
        component={PubReservationScreen}
        options={{title: 'Bookings'}}
      />
      <Stack.Screen
        name="PubReservationDetailsScreen"
        component={PubReservationDetailsScreen}
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

export default PubBookingNavigator;
