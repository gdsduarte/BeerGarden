import React, {useState, useContext, useEffect} from 'react';
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
import AuthContext from '../../../contexts/AuthContext';

const BookingInputScreen = ({route}) => {
  const {
    pubId,
    selectedDate,
    selectedHour,
    pubName,
    tables,
    totalAvailableSeats,
    
  } = route.params;
  const [partySize, setPartySize] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const navigation = useNavigation();
  const {currentUserUID} = useContext(AuthContext);
  const [reservationName, setReservationName] = useState('');

  // Logic to calculate table allocation
  const calculateTableAllocation = (partySize, slotAvailability) => {
    // Convert tables object into an array of [tableSize, count] and sort by table size descending
    const tableSizes = Object.entries(tables)
      .map(([type, count]) => ({
        size: parseInt(type.split('-')[0], 10),
        count,
        type,
      }))
      .sort((a, b) => b.size - a.size);

    let remainingPartySize = partySize;
    const allocationMap = {};

    for (const {size, count, type} of tableSizes) {
      if (remainingPartySize <= 0) break;

      let neededTables = Math.floor(remainingPartySize / size);
      if (neededTables > count) neededTables = count;

      if (neededTables > 0) {
        allocationMap[type] = (allocationMap[type] || 0) + neededTables;
        remainingPartySize -= neededTables * size;
      }
    }

    // Check for any possible way to fit remaining party size in a single table
    if (remainingPartySize > 0) {
      const singleTableFit = tableSizes.find(
        ({size, count}) =>
          size >= remainingPartySize && (allocationMap[type] || count) > 0,
      );
      if (singleTableFit) {
        allocationMap[singleTableFit.type] =
          (allocationMap[singleTableFit.type] || 0) + 1;
        remainingPartySize = 0;
      }
    }

    if (remainingPartySize > 0) {
      // Unable to fully allocate party to tables
      return null;
    }

    return allocationMap;
  };

  const handleReservationSubmit = async () => {
    const size = parseInt(partySize, 10);
    if (size <= 0 || size > totalAvailableSeats) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid party size within the available seats.',
      );
      return;
    }

    /* // Updated calculateTableAllocation to consider current availability
    const tableAllocation = calculateTableAllocation(size, tables);
    if (!tableAllocation) {
      Alert.alert(
        'Sorry',
        'Unable to allocate tables based on party size and current availability.',
      );
      return;
    } */

    // Calculate table allocation based on passed slotAvailability
    const { canAccommodate, tableAllocation } = calculateTableAllocation(partySize, slotAvailability.tables);

    if (!canAccommodate) {
      Alert.alert('Sorry', 'Unable to accommodate the party size with available tables.');
      return;
    }

    const reservationData = {
      userId: currentUserUID,
      reservationName,
      pubId,
      pubName,
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>
      <Text>Pub: {pubName}</Text>
      <Text>Date: {selectedDate}</Text>
      <Text>Time: {selectedHour}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={reservationName}
        onChangeText={setReservationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Party Size"
        value={partySize}
        onChangeText={setPartySize}
        keyboardType="number-pad"
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
