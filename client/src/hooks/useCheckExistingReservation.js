/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useCheckExistingReservation = (pubId, date, timeSlot, userId) => {
  const [loading, setLoading] = useState(true);
  const [existingReservation, setExistingReservation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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
