import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PubDetailsScreen, PubReviewsScreen, PubEventsScreen} from '@screens';

const Tab = createMaterialTopTabNavigator();

const PubNavigator = ({pubId}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="PubDetails" options={{title: 'Details'}}>
        {() => <PubDetailsScreen pubId={pubId} />}
      </Tab.Screen>
      <Tab.Screen name="PubEvents" options={{title: 'Events'}}>
        {() => <PubEventsScreen pubId={pubId} />}
      </Tab.Screen>
      <Tab.Screen name="PubReviews" options={{title: 'Reviews'}}>
        {() => <PubReviewsScreen pubId={pubId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default PubNavigator;
