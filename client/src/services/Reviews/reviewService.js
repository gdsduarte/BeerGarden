/**
 * ReviewService to manager reviews in the database
 */

import firestore from '@react-native-firebase/firestore';

const db = firestore();
const pubReviewRef = db.collection('pubReviews');
const foodReviewRef = db.collection('foodReviews');
const drinkReviewRef = db.collection('drinkReviews');

// Helper function to get server timestamp
const serverTimestamp = () => firestore.FieldValue.serverTimestamp();

// Helper function for logging and throwing errors
const handleError = (error, message = 'An error occurred') => {
  console.error(`${message}:`, error);
  throw new Error(error.message || message); // Improved error message handling
};

// Updated addReview function with corrected parameter order and improved logging
const addReview = async (type, reviewData) => {
  try {
    const reviewRef =
      type === 'pubs'
        ? pubReviewRef
        : type === 'food'
        ? foodReviewRef
        : drinkReviewRef;

    const docRef = await reviewRef.add({
      ...reviewData,
      createdAt: serverTimestamp(),
    });
    console.log(`Review added to ${type} collection with ID: ${docRef.id}`);
  } catch (error) {
    handleError(error, 'Error adding review');
  }
};

// Get reviews from the database
const getReviews = async type => {
  try {
    const reviewRef =
      type === 'pubs'
        ? pubReviewRef
        : type === 'food'
        ? foodReviewRef
        : drinkReviewRef;
    const snapshot = await reviewRef.get();
    const reviews = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return reviews;
  } catch (error) {
    handleError(error, 'Error getting reviews');
  }
};

// Get reviews from the database by pubId
const getReviewsByPubId = async pubId => {
  try {
    const snapshot = await pubReviewRef.where('pubId', '==', pubId).get();
    const reviews = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return reviews;
  } catch (error) {
    handleError(error, 'Error getting reviews by pubId');
  }
};

// Get reviews from the database by foodId
const getReviewsByFoodId = async foodId => {
  try {
    const snapshot = await foodReviewRef.where('foodId', '==', foodId).get();
    const reviews = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return reviews;
  } catch (error) {
    handleError(error, 'Error getting reviews by foodId');
  }
};

// Get reviews from the database by drinkId
const getReviewsByDrinkId = async drinkId => {
  try {
    const snapshot = await drinkReviewRef.where('drinkId', '==', drinkId).get();
    const reviews = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return reviews;
  } catch (error) {
    handleError(error, 'Error getting reviews by drinkId');
  }
};

// Update reviews in the database
const updateReview = async (type, reviewId, reviewData) => {
  try {
    const reviewRef =
      type === 'pubs'
        ? pubReviewRef
        : type === 'food'
        ? foodReviewRef
        : drinkReviewRef;
    await reviewRef.doc(reviewId).update({
      ...reviewData,
      modifiedAt: serverTimestamp(),
    });
  } catch (error) {
    handleError(error, 'Error updating review');
  }
};

// Delete reviews from the database
const deleteReview = async (type, reviewId) => {
  try {
    const reviewRef =
      type === 'pubs'
        ? pubReviewRef
        : type === 'food'
        ? foodReviewRef
        : drinkReviewRef;
    await reviewRef.doc(reviewId).delete();
  } catch (error) {
    handleError(error, 'Error deleting review');
  }
};

export {
  addReview,
  getReviews,
  getReviewsByPubId,
  getReviewsByFoodId,
  getReviewsByDrinkId,
  updateReview,
  deleteReview,
};
