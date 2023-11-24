const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const externalAPIs = require("./externalAPIs");

admin.initializeApp();

// Existing helloWorld function
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Google APIs routes
exports.getGoogleDistanceMatrixData = externalAPIs.getGoogleDistanceMatrixData;

exports.getGoogleDirectionsData = externalAPIs.getGoogleDirectionsData;

exports.getGooglePlacesData = externalAPIs.getGooglePlacesData;

exports.getGoogleMapsData = externalAPIs.getGoogleMapsData;

exports.getGoogleGeolocationData = externalAPIs.getGoogleGeolocationData;

/* // Existing newUser function
exports.newUser = functions.auth.user().onCreate((user) => {
  console.log("A new user signed up with UID:", user.uid);
});

// Apply middleware to protected routes
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
});


// New function to trigger when a user's email is verified
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
