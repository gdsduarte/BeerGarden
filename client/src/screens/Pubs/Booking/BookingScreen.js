import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../../components/common/Loading';
import useBookingHours from '../../../hooks/useBookingHours';
import usePubDetails from '../../../hooks/usePubDetails';

const BookingScreen = ({pubId}) => {
  const navigation = useNavigation();

  const today = new Date().toISOString().split('T')[0];
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const maxDate = threeMonthsLater.toISOString().split('T')[0];

  const {pub, loading: pubDetailsLoading} = usePubDetails(pubId);
  const [selectedDate, setSelectedDate] = useState(today);
  const {availability, loading: availabilityLoading} = useBookingHours(
    pubId,
    today,
    maxDate,
  );
  
  const [markedDates, setMarkedDates] = useState({});

  const bookingSlots = Object.keys(pub?.bookingSlots || {});

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(today);
    }
  }, [selectedDate, today]);

  useEffect(() => {
    const calculateMarkedDates = () => {
      let updatedMarkedDates = {};
      const totalSeats = pub?.seatsCapacity;
  
      Object.keys(availability).forEach(date => {
        const bookedSeats = availability[date]; 
        const bookingLoad = bookedSeats / totalSeats;
  
        // Define color based on booking load
        let color = 'green';
        if (bookingLoad >= 1) {
          color = 'red';
        } else if (bookingLoad > 0.75) {
          color = 'orange';
        } else if (bookingLoad > 0.5) {
          color = 'yellow';
        }
  
        updatedMarkedDates[date] = {
          customStyles: {
            container: {
              backgroundColor: color,
            },
            text: {
              color: color === 'green' || color === 'red' ? 'white' : 'black',
            },
          },
        };
      });
  
      console.log('updatedMarkedDates pre-update:', updatedMarkedDates);
  
      setMarkedDates(updatedMarkedDates);
    };
  
    if (pub && availability) calculateMarkedDates();
  }, [pub, availability]);
  
  


  const getSlotColor = timeSlot => {
    const slots = pub?.bookingSlots?.[timeSlot] || 0;
    const booked = availability[selectedDate]?.[timeSlot] || 0;
    const bookingLoad = ((slots - booked) / slots) * 100;

    if (bookingLoad >= 75) return '#f0f0f0';
    if (bookingLoad >= 50) return 'yellow';
    if (bookingLoad > 0) return 'orange';
    return 'red';
  };

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  const renderItem = ({item: timeSlot}) => {
    const isClosed = new Date(selectedDate).getDay() === 1;
    if (isClosed) {
      return null;
    }

    return (
      <TouchableOpacity
        style={[styles.hourItem, {backgroundColor: getSlotColor(timeSlot)}]}
        onPress={() =>
          navigation.navigate('BookingInputScreen', {
            pubId,
            selectedDate,
            selectedHour: timeSlot,
            pubName: pub?.displayName || 'Selected Pub',
          })
        }
        disabled={
          availability[selectedDate] &&
          availability[selectedDate][timeSlot] <= 0
        }>
        <Text style={styles.hourText}>{timeSlot}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        onDayPress={onDayPress}
        minDate={today}
        maxDate={maxDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: {selected: true, selectedColor: '#5AC8FA'},
        }}
      />
      {selectedDate && !pubDetailsLoading && (
        <View style={styles.bookingForm}>
          <Text style={styles.formTitle}>
            Available Hours for {selectedDate}
          </Text>
          {availabilityLoading ? (
            <Loading />
          ) : (
            <FlatList
              data={bookingSlots}
              renderItem={renderItem}
              keyExtractor={item => item}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bookingForm: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hourItem: {
    width: '48%',
    padding: 10,
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  hourText: {
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default BookingScreen;
