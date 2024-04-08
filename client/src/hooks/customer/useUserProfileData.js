/**
 * This hook fetches the user's profile data from Firestore.
 * It fetches the user's profile, places visited, friends, and reviews.
 * It takes a userId as an argument and returns the user's profile data.
 */

import { useState, useEffect, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';

const useUserProfileData = userId => {
  const [profile, setProfile] = useState(null);
  const [places, setPlaces] = useState([]);
  const [friends, setFriends] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh the data
  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Fetch user's profile data
    const fetchProfile = async () => {
      try {
        const profileDoc = await firestore()
          .collection('user')
          .doc(userId)
          .get();
        if (profileDoc.exists) {
          setProfile(profileDoc.data());

          const placesCollection = await profileDoc.ref
            .collection('placesVisited')
            .get();
          setPlaces(
            placesCollection.docs.map(doc => ({id: doc.id, ...doc.data()})),
          );

          const friendsCollection = await profileDoc.ref
            .collection('friends')
            .get();
          setFriends(
            friendsCollection.docs.map(doc => ({id: doc.id, ...doc.data()})),
          );
        }
      } catch (error) {
        console.error("Failed to fetch user's profile data: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch all reviews for the user
    const fetchReviews = async () => {
      try {
        const pubReviews = await firestore()
          .collection('pubReviews')
          .where('userId', '==', userId)
          .get();
        const foodReviews = await firestore()
          .collection('foodReviews')
          .where('userId', '==', userId)
          .get();
        const drinkReviews = await firestore()
          .collection('drinkReviews')
          .where('userId', '==', userId)
          .get();

        // Combine all reviews into one array
        const combinedReviews = [
          ...pubReviews.docs,
          ...foodReviews.docs,
          ...drinkReviews.docs,
        ].map(doc => ({id: doc.id, ...doc.data()}));

        setReviews(combinedReviews);
      } catch (error) {
        console.error("Failed to fetch user's reviews: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    fetchProfile();
  }, [userId, refreshTrigger]);

  return {
    profile,
    places,
    friends,
    reviews,
    loading,
    refreshData,
  };
};

export default useUserProfileData;
