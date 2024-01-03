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

  const sendMessage = async message => {
    try {
      await firestore()
        .collection('chat')
        .doc(chatId)
        .collection('messages')
        .add({
          ...message,
          sentAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {messages, sendMessage};
};

export default useChatMessages;
