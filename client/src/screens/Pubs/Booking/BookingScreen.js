import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import Loading from '../../../components/common/Loading';
import useBookingAvailability from '../../../hooks/useBookingAvailability';
import usePubDetails from '../../../hooks/usePubDetails';
import AuthContext from '../../../contexts/AuthContext';

const BookingScreen = ({pubId}) => {
  const navigation = useNavigation();
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(new Date().setMonth(new Date().getMonth() + 3))
    .toISOString()
    .split('T')[0];

  const {pub, loading: pubDetailsLoading} = usePubDetails(pubId);
  const [selectedDate, setSelectedDate] = useState(startDate);
  const {reservations, loading: availabilityLoading} = useBookingAvailability(
    pubId,
    startDate,
    endDate,
  );
  const [markedDates, setMarkedDates] = useState({});
  const [availability, setAvailability] = useState({});
  const {currentUserUID} = useContext(AuthContext);

  // Update availability and marked dates when pub or reservations change
  useEffect(() => {
    if (pub && reservations.length > 0) {
      const availability = calculateAvailability(reservations, pub);
      setAvailability(availability);
      const updatedMarkedDates = getUpdatedMarkedDates(pub, availability);
      setMarkedDates(updatedMarkedDates);
    }
  }, [pub, reservations]);

  // Logic to calculate availability based on reservations
  const calculateAvailability = reservations => {
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

  // Logic to update marked dates based on availability of reservations
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

  // Logic to calculate booking load for a given date
  const calculateBookingLoadForDate = (date, availability, totalSeats) => {
    const dailyBookings = availability[date] || {};
    const totalBookedSeats = Object.values(dailyBookings).reduce(
      (acc, curr) => acc + curr,
      0,
    );
    return totalBookedSeats / totalSeats;
  };

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
      pubAvatar: pub.photoUrl
    });

    console.log('Remaining Seats:', remainingSeats);
    console.log('Navigating with remainingTables:', remainingTables);
  };

  // Logic to get custom styles based on booking load for a given date
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
    return {container: {backgroundColor}, text: {color: textColor}};
  };

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  // Logic to check if the pub is closed on the selected day
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

  // Logic to get color for a given time slot based on availability
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

  // TimeSlotItem component to render each time slot
  const TimeSlotItem = ({timeSlot}) => {
    // Filter the current user's reservations for the selected date and time slot
    const currentUserReservations = reservations.filter(
      reservation =>
        reservation.userId === currentUserUID &&
        reservation.date.toDate().toISOString().split('T')[0] ===
          selectedDate &&
        reservation.timeSlot === timeSlot,
    );

    const hasUserReservation = currentUserReservations.length > 0;

    return (
      <TouchableOpacity
        style={[styles.hourItem, {backgroundColor: getSlotColor(timeSlot)}]}
        onPress={() => {
          if (hasUserReservation) {
            // Ensure there is at least one reservation before navigating
            if (currentUserReservations.length > 0) {
              navigation.navigate('ReservationDetailsScreen', {
                booking: currentUserReservations[0],
              });
              console.log('Reservation:', currentUserReservations[0]);
              console.log('HasReservation:', hasUserReservation);
            }
          } else {
            // Navigate to booking input screen if no existing user reservation for this slot
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
      {/* set the selectedDate on the 06/12/2024 format */}
      <Text style={styles.formTitle}>
        Available Hours for {format(selectedDate, 'dd-MM-yyyy')}
      </Text>
      {pubDetailsLoading || availabilityLoading ? (
        <Loading />
      ) : isClosedOnSelectedDay() ? (
        <Text style={styles.closedDayText}>The pub is closed on this day.</Text>
      ) : (
        <FlatList
          data={Object.keys(pub.bookingSlots || {}).sort()}
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
