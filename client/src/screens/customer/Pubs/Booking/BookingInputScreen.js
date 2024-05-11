/**
 * This file defines the BookingInputScreen component which is used to render the reservation input form for the customer.
 * The component receives the pubId, selectedDate, selectedHour, pubName, pubAvatar, remainingSeats, and remainingTables as props.
 * It also receives the updating and bookingDetails props if the user is updating an existing reservation.
 * The component renders an input form for the user to enter their reservation details and submit the reservation.
 */

import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import AuthContext from '@contexts/AuthContext';
import {format} from 'date-fns';
import {calculateTableAllocation} from '@utils/useReservationUtils';

const BookingInputScreen = ({route}) => {
  const {
    pubId,
    selectedDate,
    selectedHour,
    pubName,
    pubAvatar,
    remainingSeats,
    remainingTables,
  } = route.params;
  const {updating, bookingDetails} = route?.params || {};
  const navigation = useNavigation();
  const {currentUserId} = useContext(AuthContext);
  const [reservationName, setReservationName] = useState('');
  const [partySize, setPartySize] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  useEffect(() => {
    if (updating && bookingDetails) {
      setPartySize(bookingDetails.partySize.toString());
    }
  }, [updating, bookingDetails]);

  // Logic to handle reservation submission for the selected pub
  const handleReservationSubmit = async () => {
    const size = parseInt(partySize, 10);

    // Calculate effective remaining seats by considering the current reservation's size if updating
    let effectiveRemainingSeats = remainingSeats;
    if (updating && bookingDetails) {
      effectiveRemainingSeats += bookingDetails.partySize;
    }

    const tableAllocation = calculateTableAllocation(size, remainingTables);

    // Validate party size
    if (!size || size <= 0) {
      Alert.alert('Invalid Party Size', 'Please enter a valid party size');
      return;
    }

    // Check if the new party size exceeds the effective remaining seats
    if (size > effectiveRemainingSeats) {
      Alert.alert(
        'Availability Issue',
        `The maximum additional party size that can currently be accommodated is ${remainingSeats}.
        \nPlease adjust your party size to ${remainingSeats} or contact the pub for more options.`,
      );
      return;
    }

    // Prepare reservation data to be submitted to Firestore
    const reservationData = {
      userName: reservationName,
      pubName,
      pubAvatar,
      date: firestore.Timestamp.fromDate(
        new Date(`${selectedDate}T${selectedHour}:00`),
      ),
      partySize: size,
      specialRequest,
      status: 'pending',
      createdAt: firestore.FieldValue.serverTimestamp(),
      timeSlot: selectedHour,
      isBooked: true,
      tableType: tableAllocation,
      numberOfTables: Object.values(tableAllocation).reduce(
        (acc, count) => acc + count,
        0,
      ),
      members: [currentUserId, pubId],
      createdBy: currentUserId,
      pubId,
    };

    const updatingData = {
      partySize: size,
      tableType: tableAllocation,
      numberOfTables: Object.values(tableAllocation).reduce(
        (acc, count) => acc + count,
        0,
      ),
    };

    try {
      // If updating, update the existing document
      if (updating) {
        await firestore()
          .collection('reservations')
          .doc(bookingDetails.id)
          .update(updatingData);
        Alert.alert('Success', 'Reservation updated successfully');
      } else {
        // If not updating, add a new reservation document
        await firestore().collection('reservations').add(reservationData);
        Alert.alert('Success', 'Reservation made successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to make reservation');
    }
  };

  // Render the reservation input form
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Image style={styles.pubAvatar} source={{uri: pubAvatar}} />
      <View style={styles.headerText}>
      <Text>Pub: {pubName}</Text>
      <Text>Date: {format(selectedDate, 'dd/MM/yyyy')}</Text>
      <Text>Time: {selectedHour}</Text>
      </View>
      </View>
      {!updating && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={reservationName}
          onChangeText={setReservationName}
          required
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Party Size"
        value={partySize}
        onChangeText={setPartySize}
        keyboardType="number-pad"
        required
      />
      {!updating && (
        <TextInput
          style={styles.input}
          placeholder="Special Requests"
          value={specialRequest}
          onChangeText={setSpecialRequest}
          multiline
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleReservationSubmit}>
        <Text style={styles.buttonText}>Confirm Reservation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  pubAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#355E3B',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default BookingInputScreen;
