import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const BookingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Screen</Text>
      {/* Add more content and styling as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adjust the background color as needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Adjust the text color as needed
    // Add any additional styling for the title
  },
  // Add more styles as needed for other elements
});

export default BookingScreen;
