/**
 * This hook is used to fetch the details of a pub from the database.
 * It takes a pubId as an argument and returns the pub details.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const usePubDetails = pubId => {
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (!pubId) {
      console.error('Invalid pubId provided');
      setLoading(false);
      setPub(null);
      return;
    }

    const unsubscribe = firestore()
      .collection('pub')
      .doc(pubId)
      .onSnapshot(
        doc => {
          if (doc.exists) {
            const pubData = doc.data();
            setPub({
              id: doc.id,
              ...pubData,
            });
          } else {
            console.log(`No pub found with ID: ${pubId}`);
            setPub(null);
          }
          setLoading(false);
        },
        error => {
          console.error('Error fetching pub details:', error);
          setLoading(false);
          setPub(null);
        },
      );

    return () => unsubscribe();
  }, [pubId]);

  return {pub, loading};
};

export default usePubDetails;
