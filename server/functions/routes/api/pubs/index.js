/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const pubController = require("./controller");

router.get("/", pubController.getPubs);
router.get("/:id", pubController.getPub);
router.post("/", pubController.createPub);
router.put("/:id", pubController.updatePub);
router.delete("/:id", pubController.deletePub);
router.get("/nearby", pubController.queryNearbyPubs);

module.exports = router;
