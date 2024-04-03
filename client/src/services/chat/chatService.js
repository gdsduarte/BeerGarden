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
  chatType,
) => {
  if (!currentUserId || !targetUserId) {
    console.error(
      "manageChatAndSendMessage: 'currentUserId' or 'targetUserId' is undefined",
    );
    return; // Prevent further execution if critical IDs are missing
  }

  let chatId = await findChat(currentUserId, targetUserId);

  // Ensure targetUserId is checked again for safety
  if (!chatId && targetUserId) {
    // If no chat found, create a new one
    chatId = await createGroup(currentUserId, targetUserId, {
      groupId: groupsRef.doc().id,
      createdBy: currentUserId,
      members: [currentUserId, targetUserId],
      type: chatType,
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
    console.error(
      "manageChatAndSendMessage: 'chatId' or 'inputText' is invalid",
    );
  }

  return chatId; // Return chatId for any further operations
};

// Sends a message to a private chat, creating the chat if it does not exist
const findChat = async (currentUserId, targetUserID, groupData) => {
  let chatId = null;

  try {
    const querySnapshot = await groupsRef
      .where('members', 'array-contains', currentUserId)
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
const createGroup = async (currentUserId, targetUserID, groupData) => {
  try {
    const newChatRef = groupsRef.doc();
    await newChatRef.set({
      ...groupData,
      createdAt: serverTimestamp(),
    });
    console.log('New group chat created:', newChatRef.id);
    return newChatRef.id;
  } catch (error) {
    handleError(error, 'Error creating group');
    return null;
  }
};

// Send a message to a specific chat
const sendMessage = async (chatId, message, chatType) => {
  try {
    await chatsRef
      .doc(chatId)
      .collection('messages')
      .add({
        ...message,
        sentAt: serverTimestamp(),
      });

    // Update the last message in the chat's group document only for group and private
    if (chatType === 'group' || chatType === 'private') {
      await groupsRef.doc(chatId).update({
        lastMessage: {...message, sentAt: serverTimestamp()},
        modifiedAt: serverTimestamp(),
      });
    }

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

const deleteMessage = async (chatId, messageId) => {
  try {
    const messagesRef = chatsRef.doc(chatId).collection('messages');
    const messageToDeleteRef = messagesRef.doc(messageId);

    // Start a batch
    const batch = db.batch();

    // Delete the specified message
    batch.delete(messageToDeleteRef);

    // Fetch the last two messages to determine if the deleted one is the last
    const lastMessages = await messagesRef
      .orderBy('sentAt', 'desc')
      .limit(2)
      .get();

    if (!lastMessages.empty) {
      let lastMessageData = null;
      const lastMessageId = lastMessages.docs[0].id;

      // If the message being deleted is the last message
      if (lastMessageId === messageId) {
        // If there's another message, use it as the last message
        if (lastMessages.docs.length > 1) {
          const newLastMessage = lastMessages.docs[1];
          lastMessageData = {
            ...newLastMessage.data(),
            sentAt: newLastMessage.data().sentAt,
          };
        }

        // Update or clear the lastMessage field in the group
        const groupRef = groupsRef.doc(chatId);
        if (lastMessageData) {
          batch.update(groupRef, {lastMessage: lastMessageData});
        } else {
          batch.update(groupRef, {lastMessage: firestore.FieldValue.delete()});
        }
      }
    }

    // Commit the batch
    await batch.commit();

    console.log('Message deleted successfully');
  } catch (error) {
    handleError(error, 'Error deleting message');
  }
};

const addMemberToGroup = async (groupId, memberId) => {
  try {
    await groupsRef.doc(groupId).update({
      members: firestore.FieldValue.arrayUnion(memberId),
    });

    console.log('Member added to group:', memberId);
  } catch (error) {
    handleError(error, 'Error adding member to group');
  }
};

const removeMemberFromGroup = async (groupId, memberId) => {
  console.log(
    `Removing member from group - Group ID: ${groupId}, Member ID: ${memberId}`,
  );
  try {
    await groupsRef.doc(groupId).update({
      members: firestore.FieldValue.arrayRemove(memberId),
    });

    console.log('Member removed from group:', memberId);
  } catch (error) {
    handleError(error, 'Error removing member from group');
  }
};

export {
  manageChatAndSendMessage,
  findChat,
  createGroup,
  sendMessage,
  updateMessage,
  deleteMessage,
  addMemberToGroup,
  removeMemberFromGroup,
};
