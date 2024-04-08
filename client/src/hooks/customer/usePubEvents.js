/**
 * This hook is used to fetch all events that are associated with a particular pub.
 * It takes the pubId as an argument and returns the events.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const usePubEvents = pubId => {
  const [pubEvents, setPubEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('event')
      .where('pubId', '==', pubId)
      .onSnapshot(
        querySnapshot => {
          const eventsArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPubEvents(eventsArray);
          setLoading(false);
        },
        error => {
          console.error('Error fetching Events:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [pubId]);

  return {pubEvents, loading};
};

export default usePubEvents;
