/* eslint-disable linebreak-style */
const firestoreService = require("../../../services/firestoreService");
const Pub = require("./model");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const GeoFirestore = require("geofirestore").GeoFirestore;

const getPubs = async (req, res) => {
  try {
    const pubs = await firestoreService.getDocuments("pub");
    res.status(200).send(pubs);
  } catch (error) {
    res.status(500).send("Error getting pubs: " + error.message);
  }
};

const getPub = async (req, res) => {
  try {
    const pub = await firestoreService.getDocument("pub", req.params.id);
    res.status(200).send(pub);
  } catch (error) {
    res.status(500).send("Error getting pub: " + error.message);
  }
};

/* const createPub = async (req, res) => {
  try {
    const pub = new Pub(req.body);
    const pubData = { ...pub };
    const pubId = await firestoreService.addDocument("pub", pubData);
    res.status(201).send({ id: pubId, ...pubData });
  } catch (error) {
    res.status(500).send("Error creating pub: " + error.message);
  }
}; */
const createPub = async (req, res) => {
  try {
    const pubData = Pub.fromData(req.body);
    const pubId = await firestoreService.addDocument("pub", pubData);
    res.status(201).send({id: pubId, ...pubData});
  } catch (error) {
    res.status(500).send("Error creating pub: " + error.message);
  }
};

const updatePub = async (req, res) => {
  try {
    const pub = new Pub(req.body);
    await firestoreService.updateDocument("pub", req.params.id, pub);
    res.status(200).send("Pub successfully updated");
  } catch (error) {
    res.status(500).send("Error updating pub: " + error.message);
  }
};

const deletePub = async (req, res) => {
  try {
    await firestoreService.deleteDocument("pub", req.params.id);
    res.status(200).send("Pub successfully deleted");
  } catch (error) {
    res.status(500).send("Error deleting pub: " + error.message);
  }
};

/* const queryNearbyPubs = async (data, context) => {
  try {
    const userLat = parseFloat(data.latitude);
    const userLong = parseFloat(data.longitude);
    const radiusInKm = parseFloat(data.radius);

    const geocollection = firestoreService.getGeocollection("pub");
    const query = geocollection.near({
      center: new admin.firestore.GeoPoint(userLat, userLong),
      radius: radiusInKm,
    });

    const pubs = [];
    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => {
      pubs.push({id: doc.id, ...doc.data()});
    });

    return {pubs}; // Return the result directly
  } catch (error) {
    console.error("Error querying nearby pubs:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Error querying nearby pubs",
    );
  }
}; */

const queryNearbyPubs = functions.https.onCall(async (data, context) => {
  const db = admin.firestore();
  const geofirestore = new GeoFirestore(db);
  const geocollection = geofirestore.collection("pub");

  const userLat = data.latitude;
  const userLong = data.longitude;
  const radius = data.radius; // Ensure radius is in kilometers

  try {
    const query = geocollection.near({
      center: new admin.firestore.GeoPoint(userLat, userLong),
      radius: radius,
    });
    const snapshot = await query.get();
    const pubs = snapshot.docs.map((doc) => {
      return {id: doc.id, ...doc.data()};
    });

    return {pubs}; // Return the result directly, no need for res.status
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});

module.exports = {
  getPubs,
  getPub,
  createPub,
  updatePub,
  deletePub,
  queryNearbyPubs,
};
