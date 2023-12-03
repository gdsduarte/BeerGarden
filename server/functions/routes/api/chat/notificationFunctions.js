/* eslint-disable linebreak-style */
/* eslint-disable indent */
// /server/functions/routes/api/chats/notification.js
const functions = require("firebase-functions");
const notificationService = require("../../../services/notificationService");
const admin = require("firebase-admin");

exports.sendNewMessageNotification = functions.firestore
  .document("chats/{chatId}/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const {chatId} = context.params;
    const message = snapshot.data();
    const chatRef = admin.firestore().collection("chats").doc(chatId);
    const chatDoc = await chatRef.get();
    const chatData = chatDoc.data();

    const promises = chatData.members.map(async (userId) => {
      if (!chatData.mutedBy.includes(userId)) {
        const userToken = await notificationService.getUserToken(userId);
        if (userToken) {
          return notificationService.sendNotification(userToken, {
            title: "New Message",
            body: message.text,
            // ... other notification data ...
          });
        }
      }
      return null;
    });

    await Promise.all(promises);
  });
