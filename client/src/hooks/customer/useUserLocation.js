/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';

const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.error('Error getting user location:', error);
        setError(error);
      },
      {enableHighAccuracy: true},
    );
  }, []);

  return {location, error};
};

export default useUserLocation;
