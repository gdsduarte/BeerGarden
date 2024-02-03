/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useReservations = userId => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('reservation')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const fetchedReservations = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt.toDate(),
              date: data.date.toDate(),
            };
          });
          setReservations(fetchedReservations);
          setLoading(false);
        },
        error => {
          console.error('Error fetching reservations:', error);
        },
      );

    return () => unsubscribe();
  }, [userId]);

  return [reservations, loading];
};

export default useReservations;
