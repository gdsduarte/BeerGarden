import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PubDetailsScreen, PubReviewsScreen} from '../screens';

const Tab = createMaterialTopTabNavigator();

const PubNavigator = ({pubId}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Details">
        {() => <PubDetailsScreen pubId={pubId} />}
      </Tab.Screen>
      <Tab.Screen name="Reviews">
        {() => <PubReviewsScreen pubId={pubId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default PubNavigator;
