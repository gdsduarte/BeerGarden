import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import Loading from './src/components/common/Loading';
import {
  LoginNavigator,
  BottomTabNavigator,
  OwnerBottomTabNavigator,
} from './src/navigation';

import { LogBox } from 'react-native';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();

enableScreens();

const AppContent = () => {
  const {isUserLoggedIn, userRole, isLoading} = useAuth();

  if (isLoading) return <Loading />;

  if (isUserLoggedIn) {
    return userRole === 'user' ? (
      <BottomTabNavigator />
    ) : (
      <OwnerBottomTabNavigator />
    );
  } else {
    return <LoginNavigator />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
