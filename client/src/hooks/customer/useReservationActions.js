/* eslint-disable prettier/prettier */
import firestore from '@react-native-firebase/firestore';

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

export const deleteReservation = async reservationId => {
  try {
    await firestore().collection('reservations').doc(reservationId).delete();
    // Handle successful deletion
  } catch (error) {
    // Handle error
    console.error('Error deleting reservation:', error);
  }
};

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
