import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
  const navigation = useNavigation();
  const {currentUserId} = useContext(AuthContext);
  const [reservationName, setReservationName] = useState('');
  const [partySize, setPartySize] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  // Logic to handle reservation submission for the selected pub
  const handleReservationSubmit = async () => {
    const size = parseInt(partySize, 10);
    const tableAllocation = calculateTableAllocation(size, remainingTables);

    // Validate party size if the party size is 0 or the input is empty
    if (!size || size <= 0) {
      Alert.alert('Invalid Party Size', 'Please enter a valid party size');
      return;
    }

    // Validate party size if the party size exceeds the remaining seats
    if (size > remainingSeats) {
      Alert.alert(
        'Availability Issue',
        `The maximum party size that can currently be accommodated is ${remainingSeats}.\nPlease adjust your party size to ${remainingSeats} or contact the pub.`,
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
    };

    console.log('tableAllocation:', tableAllocation);
    console.log('Reservation Data:', reservationData);

    try {
      await firestore().collection('reservations').add(reservationData);
      Alert.alert('Success', 'Reservation made successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to make reservation');
    }
  };

  // Render the reservation input form
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>
      <Text>Pub: {pubName}</Text>
      <Text>Date: {format(selectedDate, 'dd/MM/yyyy')}</Text>
      <Text>Time: {selectedHour}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={reservationName}
        onChangeText={setReservationName}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Party Size"
        value={partySize}
        onChangeText={setPartySize}
        keyboardType="number-pad"
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Special Requests"
        value={specialRequest}
        onChangeText={setSpecialRequest}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleReservationSubmit}>
        <Text style={styles.buttonText}>Confirm Reservation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'blue',
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
