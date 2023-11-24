/* eslint-disable linebreak-style */
const functions = require("firebase-functions");
const axios = require("axios");

exports.getGoogleDirectionsData =
functions.https.onRequest(async (req, res) => {
  const apiKey = functions.config().googleapi.key;
  const url = `https://maps.googleapis.com/maps/api/directions/json?key=${apiKey}&origin=origin_address&destination=destination_address`;

  try {
    const response = await axios.get(url);
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Google Directions API Error: ", error);
    res.status(500).send("Internal Server Error");
  }
});
