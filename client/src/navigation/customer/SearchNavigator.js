import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  SearchScreen,
  PubScreen,
  BookingInputScreen,
  ReservationDetailsScreen,
  PubEventsDetailsScreen,
} from '@screens';
import FoodNavigator from './FoodNavigator';
import DrinkNavigator from './DrinkNavigator';

const Stack = createStackNavigator();

const SearchNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchArea"
        component={SearchScreen}
        options={{title: 'Search'}}
      />
      <Stack.Screen
        name="PubScreen"
        component={PubScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingInputScreen"
        component={BookingInputScreen}
        options={{title: 'Booking'}}
      />
      <Stack.Screen
        name="ReservationDetailsScreen"
        component={ReservationDetailsScreen}
      />
      <Stack.Screen name="FoodNavigator" component={FoodNavigator} />
      <Stack.Screen name="DrinkNavigator" component={DrinkNavigator} />
      <Stack.Screen
        name="PubEventsDetails"
        component={PubEventsDetailsScreen}
        options={{title: 'Event Details'}}
      />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
