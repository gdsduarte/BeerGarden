/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useGroups = (userId, chatType) => {
  const [groups, setGoups] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('group')
      .where('members', 'array-contains', userId)
      .where('type', '==', chatType)
      .orderBy('createdAt')
      .onSnapshot(
        querySnapshot => {
          const fetchedGoups = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGoups(fetchedGoups);
        },
        error => {
          console.error('Error fetching groups:', error);
        },
      );

    return () => unsubscribe();
  }, [userId, chatType]);

  return groups;
};

export default useGroups;
