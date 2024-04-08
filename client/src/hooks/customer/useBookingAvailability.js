/**
 * This hook fetches all reservations for a given pub within a given date range. 
 * This function is used to check the availability of a pub for booking.
 * It checks if the pub is part of the members array in the reservations collection.
 */

import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';

const useBookingAvailability = (pubId, startDate, endDate) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if pubId, startDate, and endDate are valid
    if (!pubId || !startDate || !endDate) {
      console.error('Invalid pubId, startDate, or endDate');
      setLoading(false);
      return;
    }

    setLoading(true);
    // Convert startDate and endDate to Firestore Timestamp objects
    const startTimestamp = firestore.Timestamp.fromDate(new Date(startDate));
    const endTimestamp = firestore.Timestamp.fromDate(new Date(endDate));

    const unsubscribe = firestore()
      .collection('reservations')
      .where('members', 'array-contains', pubId)
      .where('date', '>=', startTimestamp)
      .where('date', '<=', endTimestamp)
      .onSnapshot(
        snapshot => {
          const fetchedReservations = [];
          snapshot.forEach(doc => {
            fetchedReservations.push({id: doc.id, ...doc.data()});
          });
          setReservations(fetchedReservations);
          setLoading(false);
        },
        error => {
          console.error('Error fetching reservations:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [pubId, startDate, endDate]);

  return {reservations, loading};
};

export default useBookingAvailability;
