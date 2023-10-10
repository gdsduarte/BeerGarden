import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from './src/services/authService';
import { enableScreens } from 'react-native-screens';
import AuthContext from './src/contexts/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import Loading from './src/components/common/Loading';

enableScreens();

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.checkUserAuthentication(setIsUserLoggedIn, setIsLoading);
    return () => unsubscribe();
  }, []);
  
  const authContext = {
    signIn: async () => {
      const token = await authService.signIn();
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        setIsUserLoggedIn(true);
      }
    },
    signOut: async () => {
      await authService.signOut();
      await AsyncStorage.removeItem('userToken');
      setIsUserLoggedIn(false);
    },
  };

  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <MainNavigator isUserLoggedIn={isUserLoggedIn} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
