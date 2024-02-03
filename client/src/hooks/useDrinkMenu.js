/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useDrinkMenu = pubId => {
  const [drinkItems, setDrinkItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('drinks')
      .where('pubId', '==', pubId)
      .orderBy('name')
      .onSnapshot(
        querySnapshot => {
          const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDrinkItems(items);
          setLoading(false);
        },
        error => {
          console.error(error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [pubId]);

  return {drinkItems, loading};
};

export default useDrinkMenu;
