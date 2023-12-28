/* eslint-disable linebreak-style */
const firestoreService = require("../../../services/firestoreService");
const Review = require("./model");

const getReviews = async (req, res) => {
  try {
    const reviews = await firestoreService.getCollection("review");
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send("Error getting reviews: " + error.message);
  }
};

const getReview = async (req, res) => {
  try {
    const review = await firestoreService.getDocument("review", req.params.id);
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send("Error getting review: " + error.message);
  }
};

const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    const reviewData = {...review};
    const reviewId = await firestoreService.addDocument("review", reviewData);
    res.status(201).send({id: reviewId, ...reviewData});
  } catch (error) {
    res.status(500).send("Error creating review: " + error.message);
  }
};

const updateReview = async (req, res) => {
  try {
    await firestoreService.updateDocument("review", req.params.id, req.body);
    res.status(200).send("Review successfully updated");
  } catch (error) {
    res.status(500).send("Error updating review: " + error.message);
  }
};

const deleteReview = async (req, res) => {
  try {
    await firestoreService.deleteDocument("review", req.params.id);
    res.status(200).send("Review successfully deleted");
  } catch (error) {
    res.status(500).send("Error deleting review: " + error.message);
  }
};

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
