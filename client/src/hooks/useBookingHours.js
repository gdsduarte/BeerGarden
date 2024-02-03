/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

const useBookingHours = (pubId, startDate, endDate) => {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!pubId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error('Invalid startDate or endDate');
          setLoading(false);
          return;
        }

        const startTimestamp = firestore.Timestamp.fromDate(start);
        const endTimestamp = firestore.Timestamp.fromDate(end);

        const reservationsSnapshot = await firestore()
          .collection('reservation')
          .where('pubId', '==', pubId)
          .where('date', '>=', startTimestamp)
          .where('date', '<=', endTimestamp)
          .get();

        const dailyBookedSeats = {};

        reservationsSnapshot.forEach(doc => {
          const { date, partySize } = doc.data();
          const dateStr = date.toDate().toISOString().split('T')[0];
          if (!dailyBookedSeats[dateStr]) {
            dailyBookedSeats[dateStr] = 0;
          }
          dailyBookedSeats[dateStr] += partySize;
        });

        setAvailability(dailyBookedSeats);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [pubId, startDate, endDate]);

  return { availability, loading };
};

export default useBookingHours;
