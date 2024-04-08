/**
 * This file contains the navigation stack for the login and signup screens.
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  LoginScreen,
  SignupSelectionScreen,
  UserSignUpScreen,
  OwnerSignUpScreen,
} from '@screens';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const LoginNavigator = ({isUserLoggedIn}) => (
  <Stack.Navigator initialRouteName={isUserLoggedIn ? 'Home' : 'Login'}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SignUp"
      component={UserSignUpScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="OwnerSignUpScreen"
      component={OwnerSignUpScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="UserSignUpScreen"
      component={UserSignUpScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Home"
      component={BottomTabNavigator}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default LoginNavigator;
