/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const reservationController = require("./controller");

router.post("/", reservationController.createReservation);
router.get("/", reservationController.getReservations);
router.get("/:id", reservationController.getReservation);
router.put("/:id", reservationController.updateReservation);
router.delete("/:id", reservationController.deleteReservation);

module.exports = router;
