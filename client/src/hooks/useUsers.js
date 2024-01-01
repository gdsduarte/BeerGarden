/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('user')
      .onSnapshot(snapshot => {
        const loadedUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(loadedUsers);
      });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  return users;
};

export default useUsers;
