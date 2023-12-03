/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
class User {
  constructor(data) {
    this.displayName = data.displayName;
    this.email = data.email;
    this.photoURL = data.photoURL;
    this.location = {
      latitude: data.location[0],
      longitude: data.location[1],
    };
    this.role = data.role;
    this.userId = admin.firestore().collection("user").doc().id;
    this.createdAt = admin.firestore.Timestamp.now();
    this.status = data.status;
    this.username = data.username;
  }
}

module.exports = User;
