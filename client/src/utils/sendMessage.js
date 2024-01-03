/* eslint-disable prettier/prettier */
import firestore from '@react-native-firebase/firestore';

const sendMessage = (chatType, messageText, userName) => {
  return firestore().collection('Chats').add({
    type: chatType,
    text: messageText,
    userName: userName, // Replace with actual user data
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export default sendMessage;
