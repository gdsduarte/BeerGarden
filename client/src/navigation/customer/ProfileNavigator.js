import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  PubScreen,
  ProfileScreen,
  BookingInputScreen,
  ReservationDetailsScreen,
  BookingScreen,
  PubEventDetailsScreen,
} from '@screens';
import FoodNavigator from './FoodNavigator';
import DrinkNavigator from './DrinkNavigator';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PubDetails"
        component={PubScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PubReviews"
        component={PubScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingInputScreen"
        component={BookingInputScreen}
        options={{headerTitle: 'Booking'}}
      />
      <Stack.Screen
        name="ReservationDetailsScreen"
        component={ReservationDetailsScreen}
        options={{headerTitle: 'Booking'}}
      />
      <Stack.Screen
        name="BookingScreen"
        component={BookingScreen}
        options={{headerTitle: 'Update Booking'}}
      />
      <Stack.Screen name="FoodNavigator" component={FoodNavigator} />
      <Stack.Screen name="DrinkNavigator" component={DrinkNavigator} />
      <Stack.Screen
        name="PubEventDetails"
        component={PubEventDetailsScreen}
        options={{title: 'Event Details'}}
      />
      {/* <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{headerTitle: 'Edit Profile'}}
      />  */}
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
