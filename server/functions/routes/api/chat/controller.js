/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */

/* useEffect(() => {
  const fetchChats = async () => {
    try {
      const result = await functions()
      .httpsCallable('getChats')({ userId: currentUserId });
      setChats(result.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  fetchChats();
}, [currentUserId]); */
const firestoreService = require("../../../services/firestoreService");
// const Chat = require("./model");

const updateNotificationSettings = async (data, context) => {
  const { chatId, userId, mute } = data;

  try {
    const chat = await firestoreService.getDocument("chats", chatId);
    if (mute) {
      chat.mute(userId);
    } else {
      chat.unmute(userId);
    }
    await firestoreService.updateDocument("chats", chatId, {
      mutedBy: chat.mutedBy,
    });
    return { success: true, mutedBy: chat.mutedBy };
  } catch (error) {
    throw new Error("Error updating notification settings: " + error.message);
  }
};

const getChats = async (data, context) => {
  const { userId } = data;
  try {
    const chatsRef = await firestoreService.getDocuments("chats");
    const snapshot = chatsRef.where("members", "array-contains", userId).get();

    const userChats = [];
    snapshot.forEach((doc) => {
      userChats.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, chats: userChats };
  } catch (error) {
    throw new Error("Error getting chats: " + error.message);
  }
};

const getChat = async (data, context) => {
  const { chatId } = data;
  try {
    const chat = await firestoreService.getDocument("chats", chatId);
    return { success: true, chat };
  } catch (error) {
    throw new Error("Error getting chat: " + error.message);
  }
};

const createChat = async (data, context) => {
  // const data = new Chat(req.body);
  const chatData = { ...data };
  try {
    const chatId = await firestoreService.addDocument("chats", chatData);
    return { id: chatId, ...chatData };
  } catch (error) {
    throw new Error("Error creating chat: " + error.message);
  }
};

const updateChat = async (data, context) => {
  const { chatId, lastMessage } = data;
  try {
    await firestoreService.updateDocument("chats", chatId, {
      lastMessage,
      modifiedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    throw new Error("Error updating chat: " + error.message);
  }
};

const deleteChat = async (data, context) => {
  const { chatId } = data;
  try {
    await firestoreService.deleteDocument("chats", chatId);
    return { success: true };
  } catch (error) {
    throw new Error("Error deleting chat: " + error.message);
  }
};

const deleteMessage = async (data, context) => {
  const { chatId, messageId } = data;
  try {
    await firestoreService.deleteSubCollectionDocument(
      "chats",
      chatId,
      "messages",
      messageId,
    );
    return { success: true };
  } catch (error) {
    throw new Error("Error deleting message: " + error.message);
  }
};

module.exports = {
  updateNotificationSettings,
  getChats,
  getChat,
  createChat,
  updateChat,
  deleteChat,
  deleteMessage,
};
