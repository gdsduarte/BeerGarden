/**
 * This hook is used to fetch food details from firestore based on the pubId.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFoodDetails = pubId => {
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const foodRef = firestore().collection('foods').doc(pubId);
        const doc = await foodRef.get();
        if (doc.exists) {
          setFood({id: doc.id, ...doc.data()});
        } else {
          console.error('No such pub found!');
        }

        console.log('Food Details', doc.data());
      } catch (error) {
        console.error('Error fetching pub details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pubId) {
      fetchFoodDetails();
    }
  }, [pubId]);

  return {food, loading};
};

export default useFoodDetails;
