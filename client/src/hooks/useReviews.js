/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useReviews = pubId => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pubReviews')
      .where('pubId', '==', pubId)
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

export default useReviews;
