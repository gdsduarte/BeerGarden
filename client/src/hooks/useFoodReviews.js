/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFoodReviews = itemId => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = firestore()
          .collection('foodReviews')
          .where('itemId', '==', itemId);
        const snapshot = await reviewsRef.get();

        const fetchedReviews = [];
        snapshot.forEach(doc => {
          fetchedReviews.push({id: doc.id, ...doc.data()});
        });

        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchReviews();
    }
  }, [itemId]);

  return {reviews, loading};
};

export default useFoodReviews;
