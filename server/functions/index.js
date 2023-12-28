/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Express app
const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// Import routes and Cloud Functions
const reviewFunctions = require("./routes/api/reviews/reviewFunctions");
const reservationFunctions = require("./routes/api/reservations/reservationFunctions");
const notificationFunctions = require("./routes/api/chat/notificationFunctions");

const pubsRouter = require("./routes/api/pubs");
const reservationRouter = require("./routes/api/reservations");
const reviewRouter = require("./routes/api/reviews");
const usersRouter = require("./routes/api/users");
const chatRouter = require("./routes/api/chat");

// Register API routes with the Express app
app.use("/pubs", pubsRouter);
app.use("/reservations", reservationRouter);
app.use("/reviews", reviewRouter);
app.use("/users", usersRouter);
app.use("/chat", chatRouter);

// Expose Express API as a single Cloud Function
exports.api = functions.https.onRequest(app);

// Cloud Functions for notifications
exports.notifyPubOnNewReview = reviewFunctions.notifyPubOnNewReview;
exports.notifyUserOnReviewReply = reviewFunctions.notifyUserOnReviewReply;
exports.notifyOnReservationCreation = reservationFunctions.notifyOnReservationCreation;
exports.sendNewMessageNotification = notificationFunctions.sendNewMessageNotification;

// The helloWorld example function
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// External Google API functions
/* exports.getGoogleDistanceMatrixData = externalAPIs.getGoogleDistanceMatrixData;
exports.getGoogleDirectionsData = externalAPIs.getGoogleDirectionsData;
exports.getGooglePlacesData = externalAPIs.getGooglePlacesData;
exports.getGoogleMapsData = externalAPIs.getGoogleMapsData;
exports.getGoogleGeolocationData = externalAPIs.getGoogleGeolocationData; */

// Uncomment the newUser Cloud Function if you want to handle new user sign-ups
/* // Existing newUser function
exports.newUser = functions.auth.user().onCreate((user) => {
  console.log("A new user signed up with UID:", user.uid);
});
 */
// Uncomment the onUserEmailVerified Cloud Function if you want to handle email verification
/* // New function to trigger when a user's email is verified
exports.onUserEmailVerified = functions.auth.user().onUpdate(async (change) => {
  const user = change.after.data();

  if (user.emailVerified) {
    // Add user data to Firestore
    const db = admin.firestore();
    await db.collection("users").doc(user.uid).set({
      email: user.email,
      username: user.username,
      userUID: user.uid,
      role: "user",
    });
  }
}); */

// Middleware for protected routes can be included if needed
/* // Apply middleware to protected routes
const app = express();

// Define middleware function to check if user's email is verified
const checkEmailVerified = (req, res, next) => {
  const user = req.user;
  if (user && user.emailVerified) {
    next();
  } else {
    res.status(403).send("Unauthorized");
  }
};

app.use("/protected-route", checkEmailVerified, (req, res) => {
  // Your protected logic here
}); */
