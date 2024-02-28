/* eslint-disable prettier/prettier */
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useChatMessages = chatId => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = firestore()
      .collection('chat')
      .doc(chatId)
      .collection('messages');
    const unsubscribe = messagesRef.orderBy('sentAt').onSnapshot(
      querySnapshot => {
        const fetchedMessages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      },
      error => {
        console.error('Error fetching messages:', error);
      },
    );

    return () => unsubscribe();
  }, [chatId]);

  return {messages, setMessages};
};

export default useChatMessages;
