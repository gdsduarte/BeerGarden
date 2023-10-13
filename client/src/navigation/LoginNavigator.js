import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupSelectionScreen from '../screens/SignupSelectionScreen';
import BottomTabNavigator from './BottomTabNavigator';
import UserSignUpScreen from '../screens/User/UserSignUpScreen';
import OwnerSignUpScreen from '../screens/Owner/OwnerSignUpScreen';

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
      component={SignupSelectionScreen}
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
