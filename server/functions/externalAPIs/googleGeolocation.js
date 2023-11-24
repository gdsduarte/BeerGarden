/* eslint-disable linebreak-style */
const functions = require("firebase-functions");
const axios = require("axios");

exports.getGoogleGeolocationData =
functions.https.onRequest(async (req, res) => {
  const apiKey = functions.config().googleapi.key;
  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

  try {
    const response = await axios.post(url, { /* Request Body */ });
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Google Geolocation API Error: ", error);
    res.status(500).send("Internal Server Error");
  }
});
