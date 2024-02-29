import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ReservationScreen,
  ReservationDetailsScreen,
  SpecificChatScreen,
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
      />
      <Stack.Screen name="SpecificChatScreen" component={SpecificChatScreen} />
    </Stack.Navigator>
  );
};

export default BookingNavigator;
