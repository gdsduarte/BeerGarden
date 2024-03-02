import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import {StatusBar} from 'react-native';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import Loading from './src/components/common/Loading';
import {
  LoginNavigator,
  BottomTabNavigator,
  OwnerBottomTabNavigator,
} from './src/navigation';

enableScreens();

const AppContent = () => {
  const {isUserLoggedIn, userRole, isLoading} = useAuth();

  if (isLoading) return <Loading />;

  // Conditionally render navigators based on login status and user role
  if (isUserLoggedIn) {
    switch (userRole) {
      case 'owner':
        return <OwnerBottomTabNavigator />;
      case 'user':
      default:
        return <BottomTabNavigator />;
    }
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
