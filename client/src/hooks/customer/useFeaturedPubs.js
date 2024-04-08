/**
 * This hook is used to fetch all the premium pubs from the database to be displayed on the Home screen.
 */

import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFeaturedPubs = () => {
  const [featuredPubs, setFeaturedPubs] = useState([]);
  const [loadingPubs, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pub')
      .where('premium', '==', true)
      .onSnapshot(
        querySnapshot => {
          const pubsArray = [];

          querySnapshot.forEach(doc => {
            pubsArray.push({
              ...doc.data(),
              id: doc.id,
            });
          });

          setFeaturedPubs(pubsArray);
          if (loadingPubs) {
            setLoading(false);
          }
        },
        error => {
          console.error('Error fetching pubs:', error);
        },
      );

    return () => unsubscribe();
  }, [loadingPubs]);

  return {featuredPubs, loadingPubs};
};

export default useFeaturedPubs;
