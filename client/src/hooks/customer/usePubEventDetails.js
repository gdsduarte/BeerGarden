/**
 * This hook is used to fetch the event details of an event.
 * It takes an eventId as an argument and returns the event details.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const usePubEventDetails = eventId => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('event')
      .doc(eventId)
      .onSnapshot(
        doc => {
          setEventDetails(doc.data());
          setLoading(false);
        },
        error => {
          console.error('Error fetching Event Details:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [eventId]);

  return [eventDetails, loading];
};

export default usePubEventDetails;
