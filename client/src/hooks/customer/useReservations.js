/**
 * This hook fetches all reservations for a given user.
 * It fetches reservations where the user is a member of the reservation.
 * It also updates the reservation status to completed if the reservation date is in the past and the reservation is booked.  
 */

import firestore from '@react-native-firebase/firestore';
import {useState, useEffect} from 'react';

const useReservations = userId => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const unsubscribe = firestore()
      .collection('reservations')
      .where('members', 'array-contains', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const updates = [];
          const fetchedReservations = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const reservationDate = data.date.toDate();
            // If the reservation date is in the past and it is booked, mark it as completed
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
