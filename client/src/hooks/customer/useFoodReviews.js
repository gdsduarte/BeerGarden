import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFoodReviews = itemId => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('foodReviews')
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

export default useFoodReviews;
