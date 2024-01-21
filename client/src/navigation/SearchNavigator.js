import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SearchScreen, PubScreen} from '../screens';
import MenuNavigator from './MenuNavigator';

const Stack = createStackNavigator();

const SearchNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchArea" component={SearchScreen} />
      <Stack.Screen
        name="PubScreen"
        component={PubScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MenuNavigator" component={MenuNavigator} />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
