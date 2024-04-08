/**
 * This hook is used to check if a reservation already exists for a given pub, date, time slot and user.
 * It is used to prevent duplicate reservations for the same user.
 * If a reservation exists, the existing reservation details are returned.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useCheckExistingReservation = (pubId, date, timeSlot, userId) => {
  const [loading, setLoading] = useState(true);
  const [existingReservation, setExistingReservation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if pubId, date, timeSlot, and userId are valid
    if (!pubId || !date || !timeSlot || !userId) {
      setExistingReservation(null);
      setError('Missing parameters for checking existing reservation');
      return;
    }

    const checkExistingReservation = async () => {
      setLoading(true);
      setError(null);

      try {
        const querySnapshot = await firestore()
          .collection('reservations')
          .where('pubId', '==', pubId)
          .where('date', '==', firestore.Timestamp.fromDate(new Date(date)))
          .where('timeSlot', '==', timeSlot)
          .where('userId', '==', userId)
          .get();

        if (!querySnapshot.empty) {
          setExistingReservation(querySnapshot.docs.map(doc => doc.data())[0]);
        } else {
          setExistingReservation(null);
        }
      } catch (err) {
        setError(err.message);
        setExistingReservation(null);
      } finally {
        setLoading(false);
      }
    };

    checkExistingReservation();
  }, [pubId, date, timeSlot, userId]);

  return {loading, existingReservation, error};
};

export default useCheckExistingReservation;
