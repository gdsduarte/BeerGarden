import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  PubScreen,
  ProfileScreen,
  BookingInputScreen,
  ReservationDetailsScreen,
} from '../../screens';
import MenuNavigator from './MenuNavigator';

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
      <Stack.Screen name="MenuNavigator" component={MenuNavigator} />
      <Stack.Screen name="DrinkNavigator" component={MenuNavigator} />
      {/* <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{headerTitle: 'Edit Profile'}}
      />  */}
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
