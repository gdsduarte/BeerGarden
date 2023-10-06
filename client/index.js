/**
 * This file bootstraps your React Native app by rendering the main App component (from App.tsx). It's the starting point when you * run your app.
 * 
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
