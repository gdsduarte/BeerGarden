/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useBookingHours = (pubId, startDate, endDate) => {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!pubId) {
        return;
      }

      setLoading(true);
      try {
        // Fetch pub details to get booking slots information
        const pubRef = await firestore().collection('pub').doc(pubId).get();
        const pubData = pubRef.exists ? pubRef.data() : null;
        const bookingSlots = pubData ? pubData.bookingSlots : {};

        const startTimestamp = firestore.Timestamp.fromDate(
          new Date(startDate),
        );
        const endTimestamp = firestore.Timestamp.fromDate(new Date(endDate));
        const reservationsSnapshot = await firestore()
          .collection('reservation')
          .where('pubId', '==', pubId)
          .where('date', '>=', startTimestamp)
          .where('date', '<=', endTimestamp)
          .get();

        // Initialize availability with the booking slots
        const updatedAvailability = JSON.parse(JSON.stringify(bookingSlots)); // Deep copy to avoid mutation

        reservationsSnapshot.forEach(doc => {
          const {timeSlot, numberOfTables} = doc.data();
          // For each reservation, decrement the available slots for the corresponding time
          if (updatedAvailability[timeSlot] !== undefined) {
            updatedAvailability[timeSlot] -= numberOfTables;
          }
        });

        // Ensure availability does not go below 0
        Object.keys(updatedAvailability).forEach(slot => {
          if (updatedAvailability[slot] < 0) {
            updatedAvailability[slot] = 0;
          }
        });

        // Update state with the new availability
        setAvailability(updatedAvailability);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [pubId, startDate, endDate]);

  return {availability, loading};
};

export default useBookingHours;
