import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DrinkMenuScreen from '../../screens/business/DrinkMenuScreen';
import FoodMenuScreen from '../../screens/business/FoodMenuScreen';
import AuthContext from '../../contexts/AuthContext';

const Tab = createMaterialTopTabNavigator();

const MenuScreenTab = () => {
  const {currentUserId} = React.useContext(AuthContext);
  return (
    //pass the currentUserId to the screens
    <Tab.Navigator>
      <Tab.Screen
        name="Food"
        component={() => <FoodMenuScreen pubId={currentUserId} />}
      />
      <Tab.Screen
        name="Drinks"
        component={() => <DrinkMenuScreen pubId={currentUserId} />}
      />
    </Tab.Navigator>
  );
};

export default MenuScreenTab;
