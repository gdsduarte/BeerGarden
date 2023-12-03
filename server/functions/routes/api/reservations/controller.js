/* eslint-disable linebreak-style */
const firestoreService = require("../../../services/firestoreService");
const Reservation = require("./model");

const getReservations = async (req, res) => {
  try {
    const reservations = await firestoreService.getCollection("reservation");
    res.status(200).send(reservations);
  } catch (error) {
    res.status(500).send("Error getting reservations: " + error.message);
  }
};

const getReservation = async (req, res) => {
  try {
    const reservation = await firestoreService.getDocument(
        "reservation",
        req.params.id,
    );
    res.status(200).send(reservation);
  } catch (error) {
    res.status(500).send("Error getting reservation: " + error.message);
  }
};

const createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    const reservationData = {...reservation};
    const reservationId = await firestoreService.addDocument(
        "reservation",
        reservationData,
    );
    res.status(201).send({id: reservationId, ...reservationData});
  } catch (error) {
    res.status(500).send("Error creating reservation: " + error.message);
  }
};

const updateReservation = async (req, res) => {
  try {
    await firestoreService.updateDocument(
        "reservation",
        req.params.id,
        req.body,
    );
    res.status(200).send("Reservation successfully updated");
  } catch (error) {
    res.status(500).send("Error updating reservation: " + error.message);
  }
};

const deleteReservation = async (req, res) => {
  try {
    await firestoreService.deleteDocument("reservation", req.params.id);
    res.status(200).send("Reservation successfully deleted");
  } catch (error) {
    res.status(500).send("Error deleting reservation: " + error.message);
  }
};

module.exports = {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};
