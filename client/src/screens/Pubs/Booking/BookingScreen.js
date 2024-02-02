import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import useBookingHours from '../../../hooks/useBookingHours';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../../components/common/Loading';
import usePubDetails from '../../../hooks/usePubDetails';

const BookingScreen = ({pubId}) => {
  const navigation = useNavigation();
  const {pub, loading: pubDetailsLoading} = usePubDetails(pubId);
  const [selectedDate, setSelectedDate] = useState('');

  // Initial setup for dates
  const today = new Date().toISOString().split('T')[0];
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const maxDate = threeMonthsLater.toISOString().split('T')[0];

  // Use the hook to get availability and loading status for the selected pub
  const {availability, loading: availabilityLoading} = useBookingHours(
    pubId,
    today,
    maxDate,
  );

  // Log the availability and bookingSlots for debugging
  console.log('Availability:', availability);
  console.log(
    'Booking Slots from Pub:',
    pub ? pub.bookingSlots : 'No pub data',
  );

  // Extract and sort booking slots from pub details
  const bookingSlots = pub ? pub.bookingSlots.sort() : [];

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(today);
    }
  }, [selectedDate, today]);

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  // Determine if a specific time slot is fully booked
  const isHourBooked = time => {
    // If there's no availability data for the selected date, consider it fully booked
    if (!availability || !availability[selectedDate]) return true;

    // If the specific time slot is not found in availability or it's 0, consider it fully booked
    return (
      availability[selectedDate][time] === undefined ||
      availability[selectedDate][time] <= 0
    );
  };

  const handleHourSelect = hour => {
    // Navigate only if the hour is not fully booked
    if (!isHourBooked(hour)) {
      navigation.navigate('BookingInputScreen', {
        pubId,
        selectedDate,
        selectedHour: hour,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        minDate={today}
        maxDate={maxDate}
        pastScrollRange={0}
        futureScrollRange={3}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: '#5AC8FA',
            selectedTextColor: '#ffffff',
          },
        }}
        theme={{
          arrowColor: '#000000',
          todayTextColor: '#5AC8FA',
          monthTextColor: '#5AC8FA',
          textMonthFontWeight: 'bold',
        }}
      />
      {selectedDate && (
        <View style={styles.bookingForm}>
          <Text style={styles.formTitle}>
            Available Hours for {selectedDate}
          </Text>
          {availabilityLoading || pubDetailsLoading ? (
            <Loading />
          ) : (
            bookingSlots.map(time => {
              const hourIsBooked = !availability || availability[time] <= 0;
              console.log(`Time: ${time}, Available: ${!hourIsBooked}`);
              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.hourItem,
                    hourIsBooked ? styles.bookedHour : styles.availableHour,
                  ]}
                  onPress={() =>
                    !hourIsBooked
                      ? navigation.navigate('BookingInputScreen', {
                          pubId: pubId,
                          selectedDate: selectedDate,
                          selectedHour: time,
                          pubName: pub ? pub.displayName : 'Selected Pub',
                        })
                      : null
                  }
                  disabled={hourIsBooked}>
                  <Text
                    style={
                      hourIsBooked
                        ? styles.bookedHourText
                        : styles.availableHourText
                    }>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })
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
    padding: 10,
    marginVertical: 5,
    borderRadius: 5, // Adding some styling
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  availableHour: {
    backgroundColor: '#f0f0f0',
  },
  bookedHour: {
    backgroundColor: '#ffcccc',
  },
  availableHourText: {
    color: '#000000',
  },
  bookedHourText: {
    color: '#ffffff',
  },
  // Additional styles as needed
});

export default BookingScreen;
