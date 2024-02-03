/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Convert decimal degrees to radians
  function toRadians(degree) {
    return (degree * Math.PI) / 180;
  }

  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Haversine formula
  let dlat = lat2 - lat1;
  let dlon = lon2 - lon1;
  let a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let r = 6371;

  return c * r;
}

const useNearbyPubs = (userLatitude, userLongitude, maxDistance) => {
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
            const distance = calculateDistance(
              userLatitude,
              userLongitude,
              location.latitude,
              location.longitude,
            );
            // Filter based on max distance
            if (distance <= maxDistance) {
              list.push({
                id: doc.id,
                name: displayName,
                latitude: location.latitude,
                longitude: location.longitude,
                image: photoUrl,
                distance: distance,
              });
            }
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

    return () => unsubscribe();
  }, [loading, userLatitude, userLongitude, maxDistance]);

  return {pubs, loading};
};

export default useNearbyPubs;
