/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useAllMenuItems = searchTerm => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if searchTerm is not empty
    if (searchTerm.trim()) {
      // Convert searchTerm to lowercase for case-insensitive search
      const searchKeyword = searchTerm.toLowerCase();

      // Fetch food items
      const fetchFood = firestore()
        .collection('foods')
        .where('searchKeywords', 'array-contains', searchKeyword)
        .orderBy('category', 'asc')
        .get();

      // Fetch drink items
      const fetchDrinks = firestore()
        .collection('drinks')
        .where('searchKeywords', 'array-contains', searchKeyword)
        .orderBy('category', 'asc')
        .get();

      Promise.all([fetchFood, fetchDrinks])
        .then(responses => {
          const combinedItems = responses.flatMap(response =>
            response.docs.map(doc => ({
              id: doc.id,
              type: doc.ref.parent.id,
              ...doc.data(),
            })),
          );
          setMenuItems(combinedItems);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching menu items:', error);
          setLoading(false);
        });
    } else {
      setMenuItems([]);
      setLoading(false);
    }
  }, [searchTerm]);

  return {menuItems, loading};
};

export default useAllMenuItems;
