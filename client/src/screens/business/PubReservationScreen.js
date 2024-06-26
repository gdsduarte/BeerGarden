import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useReservations} from '@hooks';
import {fetchUserDetailsById} from '../../hooks/customer/useReservationActions';
import AuthContext from '@contexts/AuthContext';
import Loading from '@components/common/Loading';
import {format} from 'date-fns';

const Tab = createMaterialTopTabNavigator();

const PubReservationScreen = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: styles.tabBar}}>
      <Tab.Screen name="Upcoming">
        {props => <BookingsTab {...props} isBooked={true} />}
      </Tab.Screen>
      <Tab.Screen name="Past">
        {props => <BookingsTab {...props} isBooked={false} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const BookingsTab = ({navigation, isBooked}) => {
  const {currentUserId} = useContext(AuthContext);
  const [reservations, loading] = useReservations(currentUserId);

  if (loading) {
    return <Loading />;
  }

  // Filtering based on 'group' field in Firestore
  const bookings = reservations.filter(
    reservation => reservation.isBooked === isBooked,
  );

  return <BookingsList bookings={bookings} navigation={navigation} />;
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

const BookingItem = ({booking, navigation}) => {
  const formattedDate = format(booking.date, 'dd/MM/yyyy');
  const formattedTime = format(booking.date, 'HH:mm');
  const [userDetails, setUserDetails] = useState(null);
  const {currentUserId} = useContext(AuthContext);

  useEffect(() => {
    fetchUserDetailsById(booking.createdBy).then(user => setUserDetails(user));
  }, [booking.userId]);

  if (!userDetails) {
    return <Loading />;
  }

  console.log('BookingItem:', userDetails);

  const onBookingPress = () => {
    navigation.navigate('PubReservationDetailsScreen', {booking});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bookingItem} onPress={onBookingPress}>
        <View style={styles.bookingHeader}>
          <Image
            source={{uri: userDetails.photoUrl}}
            style={styles.pubAvatar}
          />
          <Text style={styles.pubName}>{userDetails.displayName}</Text>
          <Text style={styles.pubName}>
            {formattedDate} {formattedTime}
          </Text>
        </View>
        <Text style={styles.bookingDetail}>Status: {booking.status}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  bookingItem: {
    backgroundColor: '#355E3B',
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
    borderColor: '#FFF',
  },
  pubName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    marginLeft: 10,
  },
  qrCodeIcon: {
    padding: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tabLabel: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default PubReservationScreen;
