/* eslint-disable linebreak-style */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {GeoFirestore} = require("geofirestore");

admin.initializeApp();
const firestore = admin.firestore();
const geofirestore = new GeoFirestore(firestore);

const addPubLocation = functions.https.onCall((data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in to add locations.",
    );
  }

  const {pubId, name, latitude, longitude} = data;
  const geopoint = new admin.firestore.GeoPoint(latitude, longitude);

  // Add a document to the GeoCollection
  const geocollection = geofirestore.collection("pubs");
  return geocollection
      .doc(pubId)
      .set({
        name: name,
        coordinates: geopoint,
      })
      .then(() => {
        return {result: `Location for ${name} added successfully.`};
      })
      .catch((error) => {
        throw new functions.https.HttpsError("unknown", error.message);
      });
});

const queryNearbyPubs = functions.https.onCall((data, context) => {
  const {latitude, longitude, radiusInKm} = data;
  const center = new admin.firestore.GeoPoint(latitude, longitude);

  // Create a GeoQuery based on the center and radius
  const geocollection = geofirestore.collection("pubs");
  const query = geocollection.near({center: center, radius: radiusInKm});

  return query
      .get()
      .then((value) => {
        return value.docs.map((doc) => {
          return {...doc.data(), distance: doc.distance};
        });
      })
      .catch((error) => {
        throw new functions.https.HttpsError("unknown", error.message);
      });
});

module.exports = {
  addPubLocation,
  queryNearbyPubs,
};
