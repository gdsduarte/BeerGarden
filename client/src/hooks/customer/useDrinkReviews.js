import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useDrinkReviews = itemId => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('Item 222:', itemId);
  console.log('Review 222:', reviews);

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
