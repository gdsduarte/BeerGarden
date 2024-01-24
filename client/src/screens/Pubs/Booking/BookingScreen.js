import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

const BookingScreen = () => {
  const [bookingHours, setBookingHours] = useState([]); // Replace with actual data fetching logic

  useEffect(() => {
    // Fetch available booking hours and set them in state
    // setBookingHours(fetchedHours);
  }, []);

  const handleBookingSelect = hour => {
    // Handle booking logic when a time slot is selected
    console.log('Selected booking hour:', hour);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Booking Hours</Text>
      <FlatList
        data={bookingHours}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.bookingItem}
            onPress={() => handleBookingSelect(item)}>
            <Text>{item.hour}</Text>{' '}
            {/* Replace with your actual data property */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bookingItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    // Add more styles for booking items
  },
});

export default BookingScreen;
