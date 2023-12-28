import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import {decode, encode} from 'base-64';
import authService from './src/services/authService';
import AuthContext from './src/contexts/AuthContext';
import LoginNavigator from './src/navigation/LoginNavigator';
import Loading from './src/components/common/Loading';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import {StatusBar} from 'react-native';
import NavigationContext from './src/contexts/NavigationContext';

// Global configurations
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;
enableScreens();

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabBarVisible, setTabBarVisibility] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.checkUserAuthentication(user => {
      setIsUserLoggedIn(!!user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authContext = {
    signIn: async () => {
      await authService.signIn();
      setIsUserLoggedIn(true);
    },
    signOut: async () => {
      await authService.signOut();
      setIsUserLoggedIn(false);
    },
  };

  if (isLoading) return <Loading />;

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContext.Provider value={{tabBarVisible, setTabBarVisibility}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
          showHideTransition={'fade'}
          animated={true}
          networkActivityIndicatorVisible={true}
        />
        <NavigationContainer>
          {isUserLoggedIn ? <BottomTabNavigator /> : <LoginNavigator />}
        </NavigationContainer>
      </NavigationContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
