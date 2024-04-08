/**
 * This file contains the functions used to interact with the database for the customer's reservation actions.
 */

import firestore from '@react-native-firebase/firestore';

// This function is used to update a reservation in the database.
export const updateReservation = async (reservationId, newDetails) => {
  try {
    await firestore()
      .collection('reservations')
      .doc(reservationId)
      .update(newDetails);
    console.log('Reservation updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating reservation:', error);
    return false;
  }
};

// This function is used to delete a reservation from the database.
export const deleteReservation = async reservationId => {
  try {
    await firestore().collection('reservations').doc(reservationId).delete();
  } catch (error) {
    console.error('Error deleting reservation:', error);
  }
};

// This function is used to fetch the details of a user using the user ID.
export const fetchUserDetailsById = async id => {
  try {
    const userDoc = await firestore().collection('user').doc(id).get();
    if (userDoc.exists) {
      return userDoc.data();
    }
  } catch (error) {
    console.error('Failed to fetch user details:', error);
  }
};

// This function is used to fetch the details of a pub using the pub ID.
export const fetchPubDetailsById = async id => {
  try {
    const pubDoc = await firestore().collection('pub').doc(id).get();
    if (pubDoc.exists) {
      return pubDoc.data();
    }
  } catch (error) {
    console.error('Failed to fetch pub details:', error);
  }
};

// This function is used to send a notification to a user.
export const sendNotificationToUser = async (notificationDetails) => {
  try {
    await firestore().collection('notifications').add({
      ...notificationDetails,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
