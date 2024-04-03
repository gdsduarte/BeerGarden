import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const usePubReviews = pubId => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pubReviews')
      .where('pubId', '==', pubId)
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
  }, [pubId]);

  return {reviews, loading};
};

export default usePubReviews;
