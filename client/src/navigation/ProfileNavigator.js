import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PubScreen, ProfileScreen} from '../screens';

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
      {/*
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{headerTitle: 'Edit Profile'}}
      /> */}
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
