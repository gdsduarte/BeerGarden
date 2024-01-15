import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import PubScreen from '../screens/PubScreen';

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
    </Stack.Navigator>
  );
};

export default SearchNavigator;
