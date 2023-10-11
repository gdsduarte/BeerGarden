import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const MainNavigator = ({ isUserLoggedIn }) => (
  <Stack.Navigator initialRouteName={isUserLoggedIn ? 'Home' : 'Login'}>
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="SignUp" 
      component={SignUpScreen}
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="Home" 
      component={BottomTabNavigator} 
      options={{ headerShown: false }} 
    />
    
  </Stack.Navigator>
);

export default MainNavigator;



