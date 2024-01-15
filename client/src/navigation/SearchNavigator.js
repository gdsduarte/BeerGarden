import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import PubDetailsScreen from '../screens/PubDetailsScreen';

const Stack = createStackNavigator();

const SearchNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchArea" component={SearchScreen} />
      <Stack.Screen
        name="PubDetailsScreen"
        component={PubDetailsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
