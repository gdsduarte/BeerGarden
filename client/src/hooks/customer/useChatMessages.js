/**
 * This hook is used to fetch messages of a chat from firestore.
 * This function is used to display chat messages in the chat screen.
 * It listens for changes in the messages collection and updates the messages state accordingly.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useChatMessages = chatId => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = firestore()
      .collection('chat')
      .doc(chatId)
      .collection('messages')
      .orderBy('sentAt', 'desc');
    const unsubscribe = messagesRef.onSnapshot(
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
