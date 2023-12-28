/* eslint-disable linebreak-style */
const functions = require("firebase-functions");
const axios = require("axios");

exports.getGooglePlacesData =
functions.https.onRequest(async (req, res) => {
  const apiKey = functions.config().googleapi.key;
  const url = `https://maps.googleapis.com/maps/api/place/js?key=${apiKey}&libraries=places&callback=initMap`;

  try {
    const response = await axios.get(url);
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Google Places API Error: ", error);
    res.status(500).send("Internal Server Error");
  }
});
