import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';
import Loading from '@components/common/Loading';
import AuthContext from '@contexts/AuthContext';
import {useBookingAvailability, usePubDetails} from '@hooks';
import {
  calculateAvailability,
  getUpdatedMarkedDates,
  isClosedOnSelectedDay,
  getSlotColor,
} from '@utils/useReservationUtils';

const BookingScreen = ({route, pubId: propPubId}) => {
  const navigation = useNavigation();
  const {updating, bookingDetails} = route?.params || {};
  const pubId = route?.params?.pubId || propPubId;
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(new Date().setMonth(new Date().getMonth() + 3))
    .toISOString()
    .split('T')[0];
  const {pub, loading: pubDetailsLoading} = usePubDetails(pubId);
  const [selectedDate, setSelectedDate] = useState(
    updating ? bookingDetails.date : startDate,
  );
  const {reservations, loading: availabilityLoading} = useBookingAvailability(
    pubId,
    startDate,
    endDate,
  );
  const [markedDates, setMarkedDates] = useState({});
  const [availability, setAvailability] = useState({});
  const {currentUserId} = useContext(AuthContext);

  // Update availability and marked dates when pub or reservations change
  useEffect(() => {
    if (pub && reservations.length > 0) {
      const availability = calculateAvailability(reservations, pub);
      setAvailability(availability);
      const updatedMarkedDates = getUpdatedMarkedDates(pub, availability);
      setMarkedDates(updatedMarkedDates);
    }
  }, [pub, reservations]);

  // Logic to navigate to BookingInputScreen with some data
  const navigateToBookingInputScreen = timeSlot => {
    const currentSlotReservations = reservations.filter(
      reservation =>
        reservation.timeSlot === timeSlot &&
        reservation.date.toDate().toISOString().split('T')[0] === selectedDate,
    );

    // Calculate the remaining capacity and table types after current reservations
    let remainingSeats = pub.seatsCapacity;
    let remainingTables = {...pub.tables};

    currentSlotReservations.forEach(reservation => {
      remainingSeats -= reservation.partySize;
      Object.keys(reservation.tableType).forEach(type => {
        remainingTables[type] =
          remainingTables[type] - reservation.tableType[type];
      });
    });

    navigation.navigate('BookingInputScreen', {
      pubId,
      selectedDate,
      selectedHour: timeSlot,
      pubName: pub.displayName,
      remainingSeats,
      remainingTables,
      pubAvatar: pub.photoUrl,
    });

    console.log('Remaining Seats:', remainingSeats);
    console.log('Navigating with remainingTables:', remainingTables);
  };

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  // TimeSlotItem component to render each time slot
  const TimeSlotItem = ({timeSlot}) => {
    const slotColor = getSlotColor(
      timeSlot,
      selectedDate,
      availability || {},
      pub || {seatsCapacity: 0},
    );
    // Filter the current user's reservations for the selected date and time slot
    const currentUserReservations = reservations.filter(
      reservation =>
        reservation.members.includes(currentUserId) &&
        reservation.date.toDate().toISOString().split('T')[0] ===
          selectedDate &&
        reservation.timeSlot === timeSlot,
    );

    const hasUserReservation = currentUserReservations.length > 0;

    return (
      <TouchableOpacity
        style={[styles.hourItem, {backgroundColor: slotColor}]}
        onPress={() => {
          if (hasUserReservation) {
            if (updating === true) {
              return;
            } else {
              navigation.navigate('ReservationDetailsScreen', {
                booking: currentUserReservations[0],
              });
            }
            console.log('Reservation:', currentUserReservations[0]);
            console.log('HasReservation:', hasUserReservation);
          } else if (updating === true) {
            navigation.navigate('ReservationDetailsScreen', {
              booking: bookingDetails,
              selectedDate,
              selectedHour: timeSlot,
            });
            console.log('New date:', selectedDate);
            console.log('New time:', timeSlot);
          } else {
            navigateToBookingInputScreen(timeSlot);
          }
        }}>
        <Text style={styles.hourText}>
          {hasUserReservation ? timeSlot + '\nYou have a booking' : timeSlot}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render the UI elements for BookingScreen
  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        onDayPress={onDayPress}
        minDate={startDate}
        maxDate={endDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: {selected: true, selectedColor: '#5AC8FA'},
        }}
      />
      {/* <Text style={styles.formTitle}>
        Available Hours for {format(new Date(selectedDate), 'dd-MM-yyyy')}
      </Text> */}
      {pubDetailsLoading || availabilityLoading ? (
        <Loading />
      ) : !pub ? (
        <Text style={styles.closedDayText}>Loading pub details...</Text>
      ) : isClosedOnSelectedDay(selectedDate, pub) ? (
        <Text style={styles.closedDayText}>The pub is closed on this day.</Text>
      ) : (
        <FlatList
          data={Object.keys(pub?.bookingSlots || {}).sort()}
          renderItem={({item}) => <TimeSlotItem timeSlot={item} />}
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
    textAlign: 'center',
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
