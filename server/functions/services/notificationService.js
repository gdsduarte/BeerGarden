/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const admin = require("firebase-admin");

const getUserToken = async (userId) => {
  // Logic to retrieve the user's device token
  const userDoc = await admin.firestore().collection("user").doc(userId).get();
  return userDoc.data().deviceToken; // Assuming deviceToken is stored in user's document
};

const getPubToken = async (pubId) => {
  // Logic to retrieve the pub's device token
  const pubDoc = await admin.firestore().collection("pub").doc(pubId).get();
  return pubDoc.data().deviceToken; // Assuming deviceToken is stored in pub's document
};

const sendNotification = async (token, notification) => {
  // Logic to send the notification
  const message = {
    token: token,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    // Add any other FCM options
  };
  return admin.messaging().send(message);
};

module.exports = {getUserToken, getPubToken, sendNotification};
