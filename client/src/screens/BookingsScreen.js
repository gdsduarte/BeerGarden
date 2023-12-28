import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import QRCode from 'react-native-qrcode-svg';

const Tab = createMaterialTopTabNavigator();

// Dummy data for bookings
const bookingsData = {
  active: [
    {
      id: 'b1',
      pubId: 'p1',
      pubName: 'The Beer Garden',
      name: 'Friday Night Gathering',
      date: '2023-12-15',
      time: '19:00',
      numberOfPeople: 4,
      specialRequests: 'Near the window',
      status: 'Approved',
      tableNumber: 5,
      qrCodeData: 'b1-qr-code',
    },
    {
      id: 'b2',
      pubId: 'p2',
      pubName: 'Bad Bobs',
      name: 'Birthday Celebration',
      date: '2023-12-20',
      time: '20:00',
      numberOfPeople: 6,
      specialRequests: 'Cake at 9 PM',
      status: 'Pending',
      tableNumber: null, // No table assigned yet
      qrCodeData: 'b2-qr-code',
    },
    // ... add more active bookings as needed
  ],
  archived: [
    {
      id: 'b3',
      pubId: 'p3',
      pubName: 'Madigans',
      name: 'Team Lunch',
      date: '2023-11-10',
      time: '13:00',
      numberOfPeople: 8,
      specialRequests: 'Vegetarian options',
      status: 'Passed',
      tableNumber: 8,
      qrCodeData: 'b3-qr-code',
    },
    {
      id: 'b4',
      pubId: 'p4',
      pubName: 'The Lotts',
      name: 'Business Meeting',
      date: '2023-11-05',
      time: '12:00',
      numberOfPeople: 3,
      specialRequests: '',
      status: 'Cancelled',
      tableNumber: null,
      qrCodeData: 'b4-qr-code',
    },
    // ... add more archived bookings as needed
  ],
};

const BookingItem = ({booking, navigation}) => {
  const [isQRCodeVisible, setQRCodeVisible] = useState(false);

  const toggleQRCodeModal = () => {
    setQRCodeVisible(!isQRCodeVisible);
  };

  const onBookingPress = () => {
    navigation.navigate('BookingDetailsScreen', {booking});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bookingItem} onPress={onBookingPress}>
        <View style={styles.bookingHeader}>
          <Image source={{uri: booking.pubAvatar}} style={styles.pubAvatar} />
          <Text style={styles.pubName}>{booking.pubName}</Text>

          {/* Conditionally render the QR code icon for non-archived bookings */}
          {booking.status !== 'Passed' && booking.status !== 'Cancelled' && (
            <TouchableOpacity
              onPress={toggleQRCodeModal}
              style={styles.qrCodeIcon}>
              <QRCode value={booking.qrCodeData} size={30} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.bookingTitle}>{booking.name}</Text>
        <Text style={styles.bookingDetail}>Status: {booking.status}</Text>
        {/* QR Code Modal */}
        <Modal
          visible={isQRCodeVisible}
          transparent={false}
          onRequestClose={toggleQRCodeModal}>
          <View style={styles.fullScreenModal}>
            <Text style={styles.modalTitle}>{booking.name}</Text>
            <Text style={styles.modalSubtitle}>
              {booking.pubName} - {booking.date}
            </Text>
            <QRCode value={booking.qrCodeData} size={200} />
            <TouchableOpacity
              onPress={toggleQRCodeModal}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

const BookingsList = ({ bookings, navigation }) => (
  <View style={styles.container}>
    <FlatList
      data={bookings}
      renderItem={({ item }) => <BookingItem booking={item} navigation={navigation} />}
      keyExtractor={item => item.id}
    />
  </View>
);

const ActiveBookings = ({ navigation }) => (
  <BookingsList bookings={bookingsData.active} navigation={navigation} />
);

const ArchivedBookings = ({ navigation }) => (
  <BookingsList bookings={bookingsData.archived} navigation={navigation} />
);

const BookingsScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Active" component={ActiveBookings} />
      <Tab.Screen name="Archived" component={ArchivedBookings} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7', // Ensure this covers the entire view
  },
  bookingItem: {
    backgroundColor: '#355E3B', // Deep green for booking items
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pubAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF', // White border for contrast
  },
  pubName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', // White text for readability
    flex: 1,
    marginLeft: 10,
  },
  qrCodeIcon: {
    padding: 8, // Sufficient padding for easy tapping
  },
  bookingTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  bookingDetail: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent background for modal
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#8B4513', // Deep amber for buttons
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  // Additional styles for top tab navigator, if necessary
  tabBar: {
    backgroundColor: '#673AB7', // Dark purple for the tab bar
  },
  tabLabel: {
    fontSize: 16,
    color: '#FFF',
  },
  // Any other styles you need
});

export default BookingsScreen;
