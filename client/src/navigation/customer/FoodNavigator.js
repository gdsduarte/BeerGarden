/**
 * This file contains the navigation for the food details and reviews screens.
 */

import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {FoodDetailScreen, FoodReviewsScreen} from '@screens';

const Tab = createMaterialTopTabNavigator();

const FoodNavigator = ({route, navigation}) => {
  const item = route.params?.params?.item;

  return (
    <Tab.Navigator>
      <Tab.Screen name="FoodDetails" options={{title: 'Details'}}>
        {() => <FoodDetailScreen item={item} navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="FoodReviews" options={{title: 'Reviews'}}>
        {() => <FoodReviewsScreen item={item} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default FoodNavigator;
