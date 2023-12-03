/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
const firestoreService = require("../../../services/firestoreService");
const Chat = require("./model");

const updateNotificationSettings = async (req, res) => {
  const { chatId, userId, mute } = req.body;

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
    res.status(200).send({ success: true, mutedBy: chat.mutedBy });
  } catch (error) {
    res
    .status(500)
    .send("Error updating notification settings: " + error.message);
  }
};

const getChats = async (req, res) => {
  const { userId } = req.params;
  try {
    const chats = await firestoreService.getDocuments("chats");
    const userChats = chats.filter((chat) => chat.members.includes(userId));
    res.status(200).send({ success: true, chats: userChats });
  } catch (error) {
    res.status(500).send("Error getting chats: " + error.message);
  }
};

const getChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await firestoreService.getDocument("chats", chatId);
    res.status(200).send({ success: true, chat });
  } catch (error) {
    res.status(500).send("Error getting chat: " + error.message);
  }
};

/* const createChat = async (req, res) => {
  const chat = new Chat(req.body);
  try {
    const chatRef = await firestoreService.addDocument("chats", chat);
    res.status(200).send({ success: true, chatId: chatRef.id });
  } catch (error) {
    res.status(500).send("Error creating chat: " + error.message);
  }
}; */

const createChat = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    const chatData = {...chat};
    const chatId = await firestoreService.addDocument("chats", chatData);
    res.status(201).send({id: chatId, ...chatData});
  } catch (error) {
    res.status(500).send("Error creating chat: " + error.message);
  }
};

const updateChat = async (req, res) => {
  const { chatId } = req.params;
  const { lastMessage } = req.body;
  try {
    await firestoreService.updateDocument("chats", chatId, {
      lastMessage,
      modifiedAt: new Date(),
    });
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send("Error updating chat: " + error.message);
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    await firestoreService.deleteDocument("chats", chatId);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send("Error deleting chat: " + error.message);
  }
};

const deleteMessage = async (req, res) => {
  const { chatId, messageId } = req.params;
  try {
    await firestoreService.deleteSubCollectionDocument(
      "chats",
      chatId,
      "messages",
      messageId,
    );
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send("Error deleting message: " + error.message);
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
