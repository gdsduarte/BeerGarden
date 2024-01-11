/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const usePubs = () => {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pub')
      .onSnapshot(
        querySnapshot => {
          const list = [];
          querySnapshot.forEach(doc => {
            const {displayName, location, photoUrl} = doc.data();
            list.push({
              id: doc.id,
              name: displayName,
              latitude: location.latitude,
              longitude: location.longitude,
              image: photoUrl,
            });
          });

          setPubs(list);
          if (loading) {
            setLoading(false);
          }
        },
        error => {
          console.error('Error fetching pubs:', error);
        },
      );

    // Unsubscribe from the listener when unmounting
    return () => unsubscribe();
  }, [loading]);

  return {pubs, loading};
};

export default usePubs;


/* const usePubs = (userLocation, nearbyRadius = 10000) => {
  // nearbyRadius in meters
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLocation) {
      const unsubscribe = firestore()
        .collection('pub')
        .where('location', 'near', {
          center: userLocation,
          radius: nearbyRadius,
        })
        .onSnapshot(
          querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
              const {displayName, location, photoUrl} = doc.data();
              list.push({
                id: doc.id,
                name: displayName,
                latitude: location.latitude,
                longitude: location.longitude,
                image: photoUrl,
              });
            });

            setPubs(list);
            if (loading) {
              setLoading(false);
            }
          },
          error => {
            console.error('Error fetching pubs:', error);
          },
        );

      // Unsubscribe from the listener when unmounting
      return () => unsubscribe();
    }
  }, [loading, userLocation, nearbyRadius]);

  return {pubs, loading};
};

export default usePubs; */

/*const usePubs = (userLocation, nearbyRadius = 10) => {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLocation) {
      const fetchNearbyPubs = async () => {
        try {
          const getNearbyPubs = functions().httpsCallable('queryNearbyPubs');
          const response = await getNearbyPubs({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            radius: nearbyRadius,
          });
          if (response.data && response.data.pubs) {
            setPubs(response.data.pubs);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching nearby pubs:', error);
          setLoading(false);
        }
      };

      fetchNearbyPubs();
    }
  }, [userLocation, nearbyRadius]);

  return { pubs, loading };
};

export default usePubs; */