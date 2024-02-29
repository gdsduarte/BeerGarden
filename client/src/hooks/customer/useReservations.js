/* eslint-disable prettier/prettier */
import firestore from '@react-native-firebase/firestore';
import {useState, useEffect} from 'react';

const useReservations = userId => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const unsubscribe = firestore()
      .collection('reservations')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const updates = [];
          const fetchedReservations = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const reservationDate = data.date.toDate();
            // Queue updates if the reservation date has passed and isBooked is true
            if (reservationDate < now && data.isBooked) {
              updates.push(
                firestore()
                  .collection('reservations')
                  .doc(doc.id)
                  .update({
                    isBooked: false,
                    status: 'completed',
                  }),
              );
            }
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt.toDate(),
              date: reservationDate,
              isBooked: reservationDate >= now ? data.isBooked : false,
            };
          });

          Promise.all(updates).then(() => {
            setReservations(fetchedReservations);
            setLoading(false);
          });
        },
        error => {
          console.error('Error fetching reservations:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [userId]);

  return [reservations, loading];
};

export default useReservations;
