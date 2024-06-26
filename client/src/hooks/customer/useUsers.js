/**
 * This hook is used to fetch all users from the database and provide a function to check if a username already exists.
 * It also provides a function to search users by partial username.
 */

import {useState, useEffect, useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('user')
      .onSnapshot(
        snapshot => {
          const loadedUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(loadedUsers);
          setLoadingUsers(false);
        },
        error => {
          console.error('Error fetching users:', error);
          setLoadingUsers(false);
        },
      );

    return () => unsubscribe();
  }, []);

  const checkUsernameExists = useCallback(async username => {
    const userRef = firestore().collection('user');
    const snapshot = await userRef.where('username', '==', username).get();
    return !snapshot.empty; // Returns true if username exists, false otherwise
  }, []);

  // Function for searching users by partial username
  const searchUsers = useCallback(
    searchText => {
      // Lowercase the search text to make the search case-insensitive
      const loweredSearchText = searchText.toLowerCase();
      const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(loweredSearchText),
      );
      return filteredUsers;
    },
    [users],
  );

  return {users, loadingUsers, checkUsernameExists, searchUsers};
};

export default useUsers;
