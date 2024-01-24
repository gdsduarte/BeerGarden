/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useBookingHours = pubId => {
  const [bookingHours, setBookingHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingHours = async () => {
      try {
        const bookingHoursRef = firestore()
          .collection('pub')
          .doc(pubId)
          .collection('bookingHours');
        const snapshot = await bookingHoursRef.get();

        const fetchedHours = [];
        snapshot.forEach(doc => {
          fetchedHours.push({id: doc.id, ...doc.data()});
        });

        setBookingHours(fetchedHours);
      } catch (error) {
        console.error('Error fetching booking hours:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pubId) {
      fetchBookingHours();
    }
  }, [pubId]);

  return {bookingHours, loading};
};

export default useBookingHours;
