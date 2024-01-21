import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import {StatusBar} from 'react-native';
import auth from '@react-native-firebase/auth';
import {decode, encode} from 'base-64';
import authService from './src/services/authService';
import AuthContext from './src/contexts/AuthContext';
import LoginNavigator from './src/navigation/LoginNavigator';
import Loading from './src/components/common/Loading';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import NavigationContext from './src/contexts/NavigationContext';
import MenuNavigator from '../client/src/navigation/MenuNavigator';

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;
enableScreens();

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserUID, setCurrentUserUID] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setIsUserLoggedIn(true);
        setCurrentUserUID(user.uid);
      } else {
        setIsUserLoggedIn(false);
        setCurrentUserUID(null);
      }
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
    currentUserUID,
  };

  if (isLoading) return <Loading />;

  /* return (
    <AuthContext.Provider value={authContext}>
      <NavigationContext.Provider
        value={{tabBarVisible: true, setTabBarVisibility: () => {}}}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <NavigationContainer>
          {isUserLoggedIn ? <BottomTabNavigator /> : <LoginNavigator />}
        </NavigationContainer>
      </NavigationContext.Provider>
    </AuthContext.Provider>
  ); */

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer
        value={{tabBarVisible: true, setTabBarVisibility: () => {}}}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {/* Your navigators go here */}
        {isUserLoggedIn ? <BottomTabNavigator /> : <LoginNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
