/* eslint-disable linebreak-style */
const firestoreService = require("../../../services/firestoreService");
const Pub = require("./model");

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

const createPub = async (req, res) => {
  try {
    const pub = new Pub(req.body);
    const pubData = {...pub};
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

module.exports = {
  getPubs,
  getPub,
  createPub,
  updatePub,
  deletePub,
};
