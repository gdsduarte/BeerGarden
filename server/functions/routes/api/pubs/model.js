/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
class Pub {
  constructor({data}) {
    this.displayName = data.displayName;
    this.email = data.email;
    this.groupId = data.groupId;
    this.pubId = data.pubId;
    this.address = data.address;
    this.location = {
      latitude: data.location[0],
      longitude: data.location[1],
    };
    this.phone = data.phone;
    this.description = data.description;
    this.photoUrl = data.photoUrl;
    this.hours = data.hours;
    this.createdAt = admin.firestore.Timestamp.now();
  }
}

module.exports = Pub;
