/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
const functions = require("firebase-functions");
const notificationService = require("../../../services/notificationService");

// Function to handle new reservation creation
exports.notifyOnReservationCreation = functions.firestore
  .document("reservations/{reservationId}")
  .onCreate(async (snapshot, context) => {
    const reservationData = snapshot.data();
    const userId = reservationData.userId;
    const pubId = reservationData.pubId;

    try {
      const userToken = await notificationService.getUserToken(userId);
      const pubToken = await notificationService.getPubToken(pubId);

      // Notify user that reservation is waiting for confirmation
      const userNotificationPromise = notificationService.sendNotification(
        userToken,
        {
          title: "Reservation Pending",
          body: `Your reservation at ${reservationData.pubName} is pending confirmation.`,
        }
      );

      // Notify pub about new reservation
      const pubNotificationPromise = notificationService.sendNotification(
        pubToken,
        {
          title: "New Reservation",
          body: `New reservation by ${reservationData.userName}.`,
        }
      );

      await Promise.all([userNotificationPromise, pubNotificationPromise]);
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  });

// Function to handle reservation updates (e.g., confirmation)
exports.notifyOnReservationUpdate = functions.firestore
  .document("reservations/{reservationId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if the reservation has been confirmed
    if (after.status === "confirmed" && before.status !== "confirmed") {
      const userId = after.userId;

      try {
        const userToken = await notificationService.getUserToken(userId);

        // Notify user that reservation is confirmed
        await notificationService.sendNotification(userToken, {
          title: "Reservation Confirmed",
          body: `Your reservation at ${after.pubName} has been confirmed.`,
        });
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  });
