/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const reviewController = require("./controller");

router.post("/", reviewController.createReview);
router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
