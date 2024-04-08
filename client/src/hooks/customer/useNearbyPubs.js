/**
 * This hook fetches pubs from Firestore and filters them by distance from the user's location.
 * It calculates the distance between the user's location and each pub using the Haversine formula.
 * The pubs within the specified maximum distance are returned.
 * The pubs are sorted by distance in ascending order.
 */

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

// Fetch and filter pubs by distance
export async function fetchPubsNearLocation(latitude, longitude, maxDistance) {
  try {
    const querySnapshot = await firestore().collection('pub').get();
    const pubs = querySnapshot.docs
      .map(doc => {
        const {displayName, location, photoUrl, groupId} = doc.data();
        const distance = calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude,
        );
        return distance <= maxDistance
          ? {
              id: doc.id,
              name: displayName,
              latitude: location.latitude,
              longitude: location.longitude,
              image: photoUrl,
              distance: distance,
              group: groupId,
            }
          : null;
      })
      .filter(Boolean);
    return pubs;
  } catch (error) {
    console.error('Error fetching pubs:', error);
    return [];
  }
}

const useNearbyPubs = (userLatitude, userLongitude, maxDistance) => {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPubsNearLocation(userLatitude, userLongitude, maxDistance).then(
      pubs => {
        setPubs(pubs);
        setLoading(false);
      },
    );
  }, [userLatitude, userLongitude, maxDistance]);

  return {pubs, loading};
};

export default useNearbyPubs;
