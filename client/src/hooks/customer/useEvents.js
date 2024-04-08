/**
 * This hook is used to fetch events that are from premium pubs.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useEvents = (onlyPremium = false) => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoading] = useState(true);

  useEffect(() => {
    let query = firestore().collection('event');

    if (onlyPremium) {
      query = query.where('isPremium', '==', true);
    }

    const unsubscribe = query.onSnapshot(
      querySnapshot => {
        const eventsArray = [];

        querySnapshot.forEach(doc => {
          eventsArray.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        setEvents(eventsArray);
        setLoading(false);
      },
      error => {
        console.error('Error fetching events:', error);
      },
    );

    return () => unsubscribe();
  }, [onlyPremium]);

  return {events, loadingEvents};
};

export default useEvents;
