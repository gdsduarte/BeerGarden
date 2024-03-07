/* eslint-disable prettier/prettier */
import {useState, useEffect, useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setLoading(false);
        },
        error => {
          console.error('Error fetching users:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  // Function to check if a username already exists
  const checkUsernameExists = useCallback(async username => {
    const userRef = firestore().collection('user');
    const snapshot = await userRef.where('username', '==', username).get();
    return !snapshot.empty; // Returns true if username exists, false otherwise
  }, []);

  return {users, loading, checkUsernameExists};
};

export default useUsers;
