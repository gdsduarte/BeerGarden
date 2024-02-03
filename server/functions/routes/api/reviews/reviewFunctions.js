/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const notificationService = require("../../../services/notificationService");

exports.notifyPubOnNewReview = functions.firestore
  .document("reviews/{reviewId}")
  .onCreate(async (snapshot, context) => {
    const reviewData = snapshot.data();
    const pubId = reviewData.pubId;

    // Logic to get the pub's notification token
    const pubToken = await notificationService.getPubToken(pubId);

    // Send notification to the pub
    const notification = {
      title: "New Review",
      body: `${reviewData.userName} left a new review.`,
    };

    await notificationService.sendNotification(pubToken, notification);
  });

exports.notifyUserOnReviewReply = functions.firestore
  .document("reviews/{reviewId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if the review has been replied to
    if (after.reply && before.reply !== after.reply) {
      const userId = after.userId;

      // Logic to get the user's notification token
      const userToken = await notificationService.getUserToken(userId);

      // Send notification to the user
      const notification = {
        title: "Review Reply",
        body: `The pub replied to your review.`,
      };

      await notificationService.sendNotification(userToken, notification);
    }
  });
