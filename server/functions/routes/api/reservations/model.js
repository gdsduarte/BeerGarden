/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
/* eslint-disable indent */
const admin = require("firebase-admin");
class Reservation {
  constructor(data) {
    this.userId = data.userId;
    this.pubId = data.pubId;
    this.time = data.time;
    this.date = data.date;
    this.userName = data.userName;
    this.pubName = data.pubName;
    this.userEmail = data.userEmail;
    this.pubEmail = data.pubEmail;
    this.pubPhone = data.pubPhone;
    this.partySize = data.partySize;
    this.status = data.status;
    this.createdAt = admin.firestore.Timestamp.now();
    this.specialRequest = data.specialRequest;
  }
}

module.exports = Reservation;
