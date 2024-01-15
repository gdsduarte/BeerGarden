import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MenuScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Screen</Text>
      {/* Add more content and styling as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // You can change the color as per your design
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // You can change the color as per your design
  },
  // Add more styles as needed
});

export default MenuScreen;
