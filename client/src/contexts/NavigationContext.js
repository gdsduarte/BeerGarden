/* eslint-disable prettier/prettier */
import React from 'react';

const NavigationContext = React.createContext({
  tabBarVisible: true,
  setTabBarVisibility: () => {},
});

export default NavigationContext;
