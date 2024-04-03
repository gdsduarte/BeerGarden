import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  HomeScreen,
  ReservationScreen,
  ReservationDetailsScreen,
  SearchScreen,
  PubEventsDetailsScreen,
  PubScreen,
  BeersDetailsScreen,
  BeersScreen,
  SpecificChatScreen,
  PubsFinderScreen,
} from '@screens';
import {FoodNavigator, DrinkNavigator} from '@navigation';

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
        name="SpecificChatScreen"
        component={SpecificChatScreen}
        options={{title: 'Chat'}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{title: 'Search'}}
      />
      <Stack.Screen
        name="PubEventsDetails"
        component={PubEventsDetailsScreen}
        options={{title: 'Event Details'}}
      />
      <Stack.Screen
        name="PubScreen"
        component={PubScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BeersScreen"
        component={BeersScreen}
        options={{title: 'Beers'}}
      />
      <Stack.Screen
        name="BeersDetailsScreen"
        component={BeersDetailsScreen}
        options={{title: 'Beer Details'}}
      />
      <Stack.Screen
        name="FoodNavigator"
        component={FoodNavigator}
      />
      <Stack.Screen
        name="DrinkNavigator"
        component={DrinkNavigator}
      />
      <Stack.Screen
        name="PubsFinderScreen"
        component={PubsFinderScreen}
        options={{title: 'Find Pubs'}}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
