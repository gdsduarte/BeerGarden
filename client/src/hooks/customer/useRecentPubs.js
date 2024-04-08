/**
 * This hook is used to fetch the 10 most recent pubs from the database.
 */

import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const useRecentPubs = () => {
  const [recentPubs, setRecentPubs] = useState([]);
  const [loadingRecentPubs, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pub')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .onSnapshot(
        querySnapshot => {
          const pubsArray = [];

          querySnapshot.forEach(doc => {
            pubsArray.push({
              ...doc.data(),
              id: doc.id,
            });
          });

          setRecentPubs(pubsArray);
          if (loadingRecentPubs) {
            setLoading(false);
          }
        },
        error => {
          console.error('Error fetching pubs:', error);
        },
      );

    return () => unsubscribe();
  }, [loadingRecentPubs]);

  return {recentPubs, loadingRecentPubs};
};

export default useRecentPubs;
