/**
 * Utility for calculating availability based on reservations.
 */
export const calculateAvailability = reservations => {
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

/**
 * Get updated marked dates based on availability.
 */
export const getUpdatedMarkedDates = (pub, availability) => {
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

/**
 * Calculate booking load for a given date.
 */
const calculateBookingLoadForDate = (date, availability, totalSeats) => {
  const dailyBookings = availability[date] || {};
  const totalBookedSeats = Object.values(dailyBookings).reduce(
    (acc, curr) => acc + curr,
    0,
  );
  return totalBookedSeats / totalSeats;
};

/**
 * Get custom styles based on booking load for a given date.
 */
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

/**
 * Get color for a given time slot based on availability.
 */
export const getSlotColor = (timeSlot, selectedDate, availability, pub) => {
  const dailyBookings = availability[selectedDate] || {};
  const totalSeats = pub.seatsCapacity || 0;
  const bookedSeatsForSlot = dailyBookings[timeSlot] || 0;
  const bookingLoad = bookedSeatsForSlot / totalSeats;

  console.log('DailyBookings: ', dailyBookings);
  console.log('Booking load:', bookingLoad);
  console.log('Booked Seats: ', bookedSeatsForSlot);
  console.log('Total Seats: ', totalSeats);

  if (bookingLoad >= 1) return 'red';
  if (bookingLoad > 0.75) return 'orange';
  if (bookingLoad > 0.5) return 'yellow';
  if (bookingLoad > 0) return 'green';
  return '#f0f0f0';
};

// Logic to check if the pub is closed on the selected day
export const isClosedOnSelectedDay = (selectedDate, pub) => {
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

/**
 * Utility for calculating table allocation.
 */
// Logic to calculate table allocation
export const calculateTableAllocation = (partySize, tables) => {
  // Ensure tables is an object to prevent the TypeError
  const safeTables = tables || {};

  // Convert tables object into an array of [tableSize, count] and sort by table size descending
  const tableSizes = Object.entries(safeTables)
    .map(([type, count]) => ({
      size: parseInt(type.split('-')[0], 10),
      count,
      type,
    }))
    .sort((a, b) => b.size - a.size);

  let remainingPartySize = partySize;
  const allocationMap = {};

  // Iterate through table sizes and allocate party size to tables
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
      ({size, count, type}) =>
        size >= remainingPartySize && (allocationMap[type] || count) > 0,
    );
    if (singleTableFit) {
      allocationMap[singleTableFit.type] =
        (allocationMap[singleTableFit.type] || 0) + 1;
      remainingPartySize = 0;
    }
  }

  if (remainingPartySize > 0) {
    return null;
  }

  return allocationMap;
};
