/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

const useChats = (userId, chatType) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('group')
      .where('members', 'array-contains', userId)
      .where('type', '==', chatType)
      .orderBy('createdAt')
      .onSnapshot(querySnapshot => {
        const fetchedChats = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(fetchedChats);
      }, error => {
        console.error('Error fetching chats:', error);
      });

    return () => unsubscribe();
  }, [userId, chatType]);

  return chats;
};


export default useChats;
