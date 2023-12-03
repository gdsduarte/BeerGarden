/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
/* eslint-disable indent */
const admin = require("firebase-admin");

class Review {
  constructor(data) {
    this.userId = data.userId;
    this.pubId = data.pubId;
    this.rating = data.rating;
    this.comment = data.comment;
    this.createdAt = admin.firestore.Timestamp.now();
    this.pubName = data.pubName;
    this.userName = data.userName;
  }
}

module.exports = Review;
