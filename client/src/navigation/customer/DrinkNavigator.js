import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {DrinkDetailScreen, DrinkReviewsScreen} from '@screens';

const Tab = createMaterialTopTabNavigator();

const DrinkNavigator = ({route, navigation}) => {
  const item = route.params?.params?.item;

  return (
    <Tab.Navigator>
      <Tab.Screen name="DrinkDetails" options={{title: 'Details'}}>
        {() => <DrinkDetailScreen item={item} navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="DrinkReviews" options={{title: 'Reviews'}}>
        {() => <DrinkReviewsScreen item={item} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default DrinkNavigator;