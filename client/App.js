/** 
  * his is the main entry point of your React Native application. 
  * You'll define your main App component here, and it's where you'll set up your main app layout, navigation, and other global * * * configurations.
*/

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text>Hello, React Native!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
