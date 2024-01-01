/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useNearbyPubs = () => {
  const [pubs, setPubs] = useState([]);

  useEffect(() => {
    // Replace this with your actual logic for fetching nearby pubs
    const unsubscribe = firestore()
      .collection('Pub')
      .limit(10) // Example: limit to 10 pubs
      .onSnapshot(querySnapshot => {
        const fetchedPubs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPubs(fetchedPubs);
      });

    return () => unsubscribe();
  }, []);

  return pubs;
};

export default useNearbyPubs;
