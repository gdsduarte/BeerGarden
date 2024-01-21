import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import QRCode from 'react-native-qrcode-svg';
import useReservations from '../../hooks/useReservations';
import AuthContext from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import {format} from 'date-fns';

const Tab = createMaterialTopTabNavigator();

const BookingItem = ({booking, navigation}) => {
  const [isQRCodeVisible, setQRCodeVisible] = useState(false);
  // Format the date and time for display
  const formattedDate = format(booking.time, 'dd/MM/yyyy');
  const formattedTime = format(booking.time, 'HH:mm');

  const toggleQRCodeModal = () => {
    setQRCodeVisible(!isQRCodeVisible);
  };

  const onBookingPress = () => {
    navigation.navigate('BookingDetailsScreen', {booking});
  };

  // Assuming QR code data needs to be generated. Replace with your logic.
  const qrCodeData = `bookingId:${booking.id}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bookingItem} onPress={onBookingPress}>
        <View style={styles.bookingHeader}>
          <Image
            source={{uri: 'https://example.com/pubAvatar.jpg'}}
            style={styles.pubAvatar}
          />
          <Text style={styles.pubName}>{booking.pubName}</Text>
          <Text style={styles.pubName}>{formattedDate} {formattedTime}</Text>
          {booking.group !== 'archived' && (
            <TouchableOpacity
              onPress={toggleQRCodeModal}
              style={styles.qrCodeIcon}>
              <QRCode value={qrCodeData} size={30} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.bookingTitle}>{booking.userName}</Text>
        <Text style={styles.bookingDetail}>Status: {booking.status}</Text>
        <Modal
          visible={isQRCodeVisible}
          transparent={false}
          onRequestClose={toggleQRCodeModal}>
          <View style={styles.fullScreenModal}>
            <Text style={styles.modalTitle}>{booking.userName}</Text>
            <Text style={styles.bookingDetail}>
              Date: {formattedDate} Time: {formattedTime}
            </Text>
            <QRCode value={qrCodeData} size={200} />
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

const BookingsList = ({bookings, navigation}) => (
  <FlatList
    data={bookings}
    renderItem={({item}) => (
      <BookingItem booking={item} navigation={navigation} />
    )}
    keyExtractor={item => item.id}
    style={styles.list}
  />
);

const BookingsTab = ({navigation, group}) => {
  const {currentUserUID} = useContext(AuthContext);
  const [reservations, loading] = useReservations(currentUserUID);

  if (loading) {
    return <Loading />;
  }

  // Filtering based on 'group' field in Firestore
  const bookings = reservations.filter(
    reservation => reservation.group === group.toLowerCase(),
  );

  return <BookingsList bookings={bookings} navigation={navigation} />;
};

const BookingsScreen = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: styles.tabBar}}>
      <Tab.Screen name="Upcoming">
        {props => <BookingsTab {...props} group="Active" />}
      </Tab.Screen>
      <Tab.Screen name="Past">
        {props => <BookingsTab {...props} group="Archived" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
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
  /* tabBar: {
    backgroundColor: '#673AB7', // Dark purple for the tab bar
  }, */
  tabLabel: {
    fontSize: 16,
    color: '#FFF',
  },
  // Any other styles you need
});

export default BookingsScreen;
