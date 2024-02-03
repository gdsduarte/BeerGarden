/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const usePubDetails = pubId => {
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPubDetails = async () => {
      try {
        const pubRef = firestore().collection('pub').doc(pubId);
        const doc = await pubRef.get();
        if (doc.exists) {
          const pubData = doc.data();
          setPub({
            id: doc.id,
            ...pubData,
            bookingSlots: pubData.bookingSlot || [],
          });
        } else {
          console.error('No such pub found!');
        }
      } catch (error) {
        console.error('Error fetching pub details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pubId) {
      fetchPubDetails();
    }
  }, [pubId]);

  return {pub, loading};
};

export default usePubDetails;
