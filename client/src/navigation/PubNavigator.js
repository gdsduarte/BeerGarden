import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ReviewsScreen from '../screens/ReviewsScreen';
import {PubDetailsScreen} from '../screens';

const Tab = createMaterialTopTabNavigator();

const PubNavigator = ({pubId}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Details">
        {() => <PubDetailsScreen pubId={pubId} />}
      </Tab.Screen>
      <Tab.Screen name="Reviews">
        {() => <ReviewsScreen pubId={pubId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default PubNavigator;
