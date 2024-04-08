/**
 * This hook is used to fetch the beers from the database.
 */

import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFeaturedBeers = () => {
  const [featuredBeers, setFeaturedBeers] = useState([]);
  const [loadingBeers, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('beers')
      .onSnapshot(
        querySnapshot => {
          const beersArray = [];

          querySnapshot.forEach(doc => {
            beersArray.push({
              ...doc.data(),
              id: doc.id,
            });
          });

          setFeaturedBeers(beersArray);
          if (loadingBeers) {
            setLoading(false);
          }
        },
        error => {
          console.error('Error fetching pubs:', error);
        },
      );

    return () => unsubscribe();
  }, [loadingBeers]);

  return {featuredBeers, loadingBeers};
};

export default useFeaturedBeers;
