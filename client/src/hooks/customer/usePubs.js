/**
 * This hook is used to fetch all the pubs from the firestore database.
 * It returns an array of pubs.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const usePubs = () => {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pub')
      .onSnapshot(
        querySnapshot => {
          const list = [];
          querySnapshot.forEach(doc => {
            const {displayName, location, photoUrl} = doc.data();
            list.push({
              id: doc.id,
              name: displayName,
              latitude: location.latitude,
              longitude: location.longitude,
              image: photoUrl,
            });
          });

          setPubs(list);
          if (loading) {
            setLoading(false);
          }
        },
        error => {
          console.error('Error fetching pubs:', error);
        },
      );

    return () => unsubscribe();
  }, [loading]);

  return {pubs, loading};
};

export default usePubs;
