/**
 * This file contains functions that interact with the Firestore database.
 */

import firestore from '@react-native-firebase/firestore';

// Add a friend to the current user's friends list
export const addFriend = async (currentUserId, userId) => {
  // Reference to the current user's friends subcollection
  const currentUserFriendRef = firestore()
    .collection('user')
    .doc(currentUserId)
    .collection('friends')
    .doc(userId);
  // Reference to the friend's friends subcollection
  const friendFriendRef = firestore()
    .collection('user')
    .doc(userId)
    .collection('friends')
    .doc(currentUserId);

  try {
    await firestore().runTransaction(async transaction => {
      const currentUserFriendDoc = await transaction.get(currentUserFriendRef);
      const friendFriendDoc = await transaction.get(friendFriendRef);

      if (currentUserFriendDoc.exists || friendFriendDoc.exists) {
        throw 'Users are already friends.';
      }

      const now = firestore.FieldValue.serverTimestamp();
      transaction.set(currentUserFriendRef, {
        friendId: userId,
        userId,
        addedOn: now,
      });
      transaction.set(friendFriendRef, {
        friendId: currentUserId,
        userId: currentUserId,
        addedOn: now,
      });
    });

    console.log('Friend added successfully.');
  } catch (error) {
    console.error('Failed to add friend:', error);
  }
};

// Remove the friend relationship between the current user and the given user
export const removeFriend = async (currentUserId, userId) => {
  // Reference to the current user's friends subcollection
  const currentUserFriendRef = firestore()
    .collection('user')
    .doc(currentUserId)
    .collection('friends')
    .doc(userId);
  // Reference to the friend's friends subcollection
  const friendFriendRef = firestore()
    .collection('user')
    .doc(userId)
    .collection('friends')
    .doc(currentUserId);

  try {
    await firestore().runTransaction(async transaction => {
      const currentUserFriendDoc = await transaction.get(currentUserFriendRef);
      const friendFriendDoc = await transaction.get(friendFriendRef);

      if (!currentUserFriendDoc.exists || !friendFriendDoc.exists) {
        throw 'Users are not friends.';
      }

      transaction.delete(currentUserFriendRef);
      transaction.delete(friendFriendRef);
    });

    console.log('Friend removed successfully.');
  } catch (error) {
    console.error('Failed to remove friend:', error);
  }
};

// Update the user's profile with the given data
export const updateProfile = async (userId, profileData) => {
  const userRef = firestore().collection('user').doc(userId);

  try {
    await userRef.update(profileData);
    console.log('Profile updated successfully.');
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};