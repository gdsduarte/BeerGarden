/* eslint-disable prettier/prettier */
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';

const useBookingAvailability = (pubId, startDate, endDate) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pubId || !startDate || !endDate) {
      console.error('Invalid pubId, startDate, or endDate');
      setLoading(false);
      return;
    }

    setLoading(true);
    const startTimestamp = firestore.Timestamp.fromDate(new Date(startDate));
    const endTimestamp = firestore.Timestamp.fromDate(new Date(endDate));

    const unsubscribe = firestore()
      .collection('reservation')
      .where('pubId', '==', pubId)
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
