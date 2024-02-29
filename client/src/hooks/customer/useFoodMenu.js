/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFoodMenu = pubId => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('foods')
      .where('pubId', '==', pubId)
      .orderBy('name')
      .onSnapshot(
        querySnapshot => {
          const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFoodItems(items);
          setLoading(false);
        },
        error => {
          console.error(error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [pubId]);

  return {foodItems, loading};
};

export default useFoodMenu;
