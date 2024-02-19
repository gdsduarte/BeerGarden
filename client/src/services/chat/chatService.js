/* eslint-disable prettier/prettier */
import firestore from '@react-native-firebase/firestore';

const db = firestore();
const chatsRef = db.collection('chat');
const groupsRef = db.collection('group');

// Helper function to get server timestamp
const serverTimestamp = () => firestore.FieldValue.serverTimestamp();

// Helper function for logging and throwing errors
const handleError = (error, message = 'An error occurred') => {
  console.error(`${message}:`, error);
  throw new Error(error);
};

// Send a message to a specific chat
const sendMessage = async (chatId, message) => {
  try {
    const messageRef = chatsRef.doc(chatId).collection('messages').doc();
    const groupRef = groupsRef.doc(chatId);

    await db.runTransaction(async (transaction) => {
      transaction.set(messageRef, {
        ...message,
        sentAt: serverTimestamp(),
      });

      transaction.update(groupRef, {
        lastMessage: { ...message, sentAt: serverTimestamp() },
        modifiedAt: serverTimestamp(),
      });
    });

    console.log('Message sent to chat:', chatId);
  } catch (error) {
    handleError(error, 'Error sending message');
  }
};

// Update a specific message in a chat
const updateMessage = async (chatId, messageId, updates) => {
  try {
    await chatsRef
      .doc(chatId)
      .collection('messages')
      .doc(messageId)
      .update(updates);

    console.log('Message updated successfully');
  } catch (error) {
    handleError(error, 'Error updating message');
  }
};

// Delete a specific message from a chat
const deleteMessage = async (chatId, messageId) => {
  try {
    await chatsRef
      .doc(chatId)
      .collection('messages')
      .doc(messageId)
      .delete();

    console.log('Message deleted successfully');
  } catch (error) {
    handleError(error, 'Error deleting message');
  }
};

// Sends a message to a private chat, creating the chat if it does not exist
const findOrCreateChat = async (currentUserId, targetUserID, message, groupData) => {
  let chatId = null;

  try {
    const querySnapshot = await groupsRef
      .where('members', 'array-contains', currentUserId)
      .where('type', '==', 'private')
      .get();

    const existingChat = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      return data.members.length === 2 && data.members.includes(targetUserID);
    });

    if (existingChat) {
      console.log('Existing private chat found:', existingChat.id);
      chatId = existingChat.id;
    } else {
      const newChatRef = groupsRef.doc();
      await newChatRef.set({
        ...groupData,
        createdAt: serverTimestamp(),
        groupID: newChatRef.id,
        modifiedAt: serverTimestamp(),
      });
      console.log('New private chat created:', newChatRef.id);
      chatId = newChatRef.id;
    }

    await sendMessage(chatId, message);
    return chatId;
  } catch (error) {
    handleError(error, 'Error sending message to private chat');
  }
};

export { sendMessage, updateMessage, deleteMessage, findOrCreateChat };

/* import firestore from '@react-native-firebase/firestore';

const db = firestore();

//Send a message to a specific chat.
const sendMessage = async (chatId, message) => {
  try {
    // Step 1: Add the new message to the chat's message collection
    await db
      .collection('chat')
      .doc(chatId)
      .collection('messages')
      .add({
        ...message,
        sentAt: firestore.FieldValue.serverTimestamp(),
      });

    // Step 2: Update the lastMessage in the corresponding group document
    await db
      .collection('group')
      .doc(chatId)
      .update({
        lastMessage: {
          ...message,
          sentAt: firestore.FieldValue.serverTimestamp(),
        },
        modifiedAt: firestore.FieldValue.serverTimestamp(),
      });

    console.log('Message sent to chat:', chatId);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

//Update a specific message in a chat.
const updateMessage = async (chatId, messageId, updates) => {
  try {
    await db
      .collection('chat')
      .doc(chatId)
      .collection('messages')
      .doc(messageId)
      .update(updates);
    console.log('Message updated successfully');
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

//Delete a specific message from a chat.
const deleteMessage = async (chatId, messageId) => {
  try {
    await db
      .collection('chat')
      .doc(chatId)
      .collection('messages')
      .doc(messageId)
      .delete();
    console.log('Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

//Sends a message to a private chat, creating the chat if it does not exist.
const findOrCreateChat = async (
  currentUserId,
  targetUserID,
  message,
  groupData,
) => {
  let chatId = null;

  try {
    // Step 1: Check for an existing chat between the two users
    const querySnapshot = await db
      .collection('group')
      .where('members', 'array-contains', currentUserId)
      .where('type', '==', 'private')
      .get();

    const existingChat = querySnapshot.docs.find(doc => {
      const data = doc.data();
      return data.members.length === 2 && data.members.includes(targetUserID);
    });

    if (existingChat) {
      console.log('Existing private chat found:', existingChat.id);
      chatId = existingChat.id;
    } else {
      // Step 2: Create a new chat group if no existing chat is found
      const newChatRef = db.collection('group').doc();
      await newChatRef.set({
        ...groupData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        groupID: newChatRef.id,
        modifiedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('New private chat created:', newChatRef.id);
      chatId = newChatRef.id;
    }

    // Step 3: Send the message to the chat
    await db
      .collection('chat')
      .doc(chatId)
      .collection('messages')
      .add({
        ...message,
        sentAt: firestore.FieldValue.serverTimestamp(),
      });

    // Optionally, update the lastMessage in the group document for existing chats
    if (existingChat) {
      await db
        .collection('group')
        .doc(chatId)
        .update({
          lastMessage: {
            ...message,
            sentAt: firestore.FieldValue.serverTimestamp(),
          },
          modifiedAt: firestore.FieldValue.serverTimestamp(),
        });
    }

    return chatId;
  } catch (error) {
    console.error('Error sending message to private chat:', error);
    throw error;
  }
};

export {sendMessage, updateMessage, deleteMessage, findOrCreateChat}; */
