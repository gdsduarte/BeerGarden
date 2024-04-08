/**
 * This hook is used to fetch all reviews for a specific drink item.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useDrinkReviews = itemId => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('drinkReviews')
      .where('itemId', '==', itemId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const reviewsArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(reviewsArray);
          setLoading(false);
        },
        error => {
          console.error('Error fetching reviews:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [itemId]);

  return {reviews, loading};
};

export default useDrinkReviews;
