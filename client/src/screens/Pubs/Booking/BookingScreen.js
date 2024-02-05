import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../../components/common/Loading';
import useBookingAvailability from '../../../hooks/useBookingAvailability';
import usePubDetails from '../../../hooks/usePubDetails';

const BookingScreen = ({ pubId }) => {
  const navigation = useNavigation();
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0];

  const { pub, loading: pubDetailsLoading } = usePubDetails(pubId);
  const [selectedDate, setSelectedDate] = useState(today);
  const { reservations, loading: availabilityLoading } = useBookingAvailability(
    pubId,
    today,
    maxDate,
  );
  const [markedDates, setMarkedDates] = useState({});
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    if (pub && reservations.length > 0) {
      const availability = calculateAvailability(reservations, pub);
      setAvailability(availability);
      const updatedMarkedDates = getUpdatedMarkedDates(pub, availability);
      setMarkedDates(updatedMarkedDates);
    }
  }, [pub, reservations]);

  const calculateAvailability = (reservations) => {
    const availability = {};
    reservations.forEach(reservation => {
      const date = reservation.date.toDate().toISOString().split('T')[0];
      const timeSlot = reservation.timeSlot;
      availability[date] = availability[date] || {};
      availability[date][timeSlot] = availability[date][timeSlot] || 0;
      availability[date][timeSlot] += reservation.partySize;
    });
    console.log(availability);
    return availability;
  };

  const getUpdatedMarkedDates = (pub, availability) => {
    let updatedMarkedDates = {};
    Object.keys(availability).forEach(date => {
      const bookingLoad = calculateBookingLoadForDate(
        date,
        availability,
        pub.seatsCapacity,
      );
      updatedMarkedDates[date] = {
        customStyles: getCustomStylesBasedOnLoad(bookingLoad),
      };
    });
    return updatedMarkedDates;
  };

  const calculateBookingLoadForDate = (date, availability, totalSeats) => {
    const dailyBookings = availability[date] || {};
    const totalBookedSeats = Object.values(dailyBookings).reduce(
      (acc, curr) => acc + curr,
      0,
    );
    return totalBookedSeats / totalSeats;
  };

  const getCustomStylesBasedOnLoad = bookingLoad => {
    let backgroundColor, textColor;
    if (bookingLoad >= 1) {
      backgroundColor = 'red';
      textColor = 'white';
    } else if (bookingLoad > 0.75) {
      backgroundColor = 'orange';
      textColor = 'black';
    } else if (bookingLoad > 0.5) {
      backgroundColor = 'yellow';
      textColor = 'black';
    } else {
      backgroundColor = 'green';
      textColor = 'white';
    }
    return { container: { backgroundColor }, text: { color: textColor } };
  };

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  const isClosedOnSelectedDay = () => {
    const dayOfWeek = new Date(selectedDate).getDay();
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const dayName = days[dayOfWeek];
    return pub.openingHours[dayName]?.toLowerCase() === 'closed';
  };

  const navigateToBookingInputScreen = timeSlot => {
    const currentSlotAvailability = availability[selectedDate]?.[timeSlot] || 0;
    const totalAvailableSeats = pub.seatsCapacity - (currentSlotAvailability || 0);
    navigation.navigate('BookingInputScreen', {
      pubId,
      selectedDate,
      selectedHour: timeSlot,
      pubName: pub.displayName || 'Selected Pub',
      tables: pub.tables || [],
      totalAvailableSeats,
    });
    console.log('total available seats:', totalAvailableSeats);
  };

  const getSlotColor = timeSlot => {
    const dailyBookings = availability[selectedDate] || {};
    const bookedSeatsForSlot = dailyBookings[timeSlot] || 0;
    const totalSeats = pub.seatsCapacity || 0;
    const bookingLoad = bookedSeatsForSlot / totalSeats;

    if (bookingLoad >= 1) return 'red';
    if (bookingLoad > 0.75) return 'orange';
    if (bookingLoad > 0.5) return 'yellow';
    if (bookingLoad > 0) return 'green';
    return '#f0f0f0';
  };

  const TimeSlotItem = ({ timeSlot }) => (
    <TouchableOpacity
      style={[styles.hourItem, { backgroundColor: getSlotColor(timeSlot) }]}
      onPress={() => navigateToBookingInputScreen(timeSlot)}>
      <Text style={styles.hourText}>{timeSlot}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        onDayPress={onDayPress}
        minDate={today}
        maxDate={maxDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: '#5AC8FA' },
        }}
      />
      <Text style={styles.formTitle}>Available Hours for {selectedDate}</Text>
      {pubDetailsLoading || availabilityLoading ? (
        <Loading />
      ) : isClosedOnSelectedDay() ? (
        <Text style={styles.closedDayText}>The pub is closed on this day.</Text>
      ) : (
        <FlatList
          data={Object.keys(pub.bookingSlots || {}).sort()}
          renderItem={({ item }) => <TimeSlotItem timeSlot={item} />}
          keyExtractor={item => item}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
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
  closedDayText: {
    textAlign: 'center',
    padding: 20,
  },
});

export default BookingScreen;
