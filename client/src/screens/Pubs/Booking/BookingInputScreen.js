import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const BookingInputScreen = ({route}) => {
  const {pubId, selectedDate, selectedHour, pubName} = route.params;
  const [partySize, setPartySize] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const navigation = useNavigation();

  const handleReservationSubmit = async () => {
    try {
      await firestore()
        .collection('reservation')
        .add({
          pubId,
          pubName,
          date: new Date(`${selectedDate}T${selectedHour}:00`),
          partySize,
          specialRequest,
          status: 'pending',
        });
      alert('Reservation made successfully');
      navigation.goBack(); // TODO: Implemente a sucessfull component
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('Failed to make reservation');
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
  // Additional styles as needed
});

export default BookingInputScreen;
