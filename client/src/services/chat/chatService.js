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

// Find or Create Chat and Send Message
const manageChatAndSendMessage = async (
  currentUserId,
  targetUserId,
  inputText,
) => {
  if (!currentUserId || !targetUserId) {
    console.error("manageChatAndSendMessage: 'currentUserId' or 'targetUserId' is undefined");
    return; // Prevent further execution if critical IDs are missing
  }

  let chatId = await findChat(currentUserId, targetUserId);

  // Ensure targetUserId is checked again for safety
  if (!chatId && targetUserId) {
    // If no chat found, create a new one
    chatId = await createChat(currentUserId, targetUserId, {
      groupId: groupsRef.doc().id,
      createdBy: currentUserId,
      members: [currentUserId, targetUserId],
      type: 'private',
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
  }

  // Ensure chatId is checked before attempting to send a message
  if (chatId && inputText.trim()) {
    await sendMessage(chatId, {
      messageText: inputText.trim(),
      sentBy: currentUserId,
      sentAt: serverTimestamp(),
    });
  } else {
    console.error("manageChatAndSendMessage: 'chatId' or 'inputText' is invalid");
  }

  return chatId; // Return chatId for any further operations
};


// Sends a message to a private chat, creating the chat if it does not exist
const findChat = async (currentUserId, targetUserID, groupData) => {
  let chatId = null;

  try {
    const querySnapshot = await groupsRef
      .where('members', 'array-contains', currentUserId)
      //.where('type', '==', 'private')
      .get();

    const existingChat = querySnapshot.docs.find(doc => {
      const data = doc.data();
      return data.members.length === 2 && data.members.includes(targetUserID);
    });

    if (existingChat) {
      console.log('Existing private chat found:', existingChat.id);
      chatId = existingChat.id;
    } else {
      return null; // No chat found
    }
    return chatId;
  } catch (error) {
    handleError(error, 'Error finding private chat');
    return null; // Return null in case of error
  }
};

// Creates a new chat group
const createChat = async (currentUserId, targetUserID, groupData) => {
  const newChatRef = groupsRef.doc();
  await newChatRef.set(groupData);
  console.log('New private chat created:', newChatRef.id);
  return newChatRef.id; // Return the new chat ID
};

// Send a message to a specific chat
const sendMessage = async (chatId, message) => {
  try {
    await chatsRef.doc(chatId).collection('messages').add({
      ...message,
      sentAt: serverTimestamp(),
    });

    // Update the last message in the chat's group document
    await groupsRef.doc(chatId).update({
      lastMessage: { ...message, sentAt: serverTimestamp() },
      modifiedAt: serverTimestamp(),
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
    await chatsRef.doc(chatId).collection('messages').doc(messageId).delete();

    console.log('Message deleted successfully');
  } catch (error) {
    handleError(error, 'Error deleting message');
  }
};

export {
  manageChatAndSendMessage,
  findChat,
  createChat,
  sendMessage,
  updateMessage,
  deleteMessage,
};
