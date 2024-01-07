/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");

class Pub {
  constructor(data) {
    this.displayName = data.displayName;
    this.email = data.email;
    this.groupId = data.groupId;
    this.address = data.address;
    this.location = data.location;
    this.phone = data.phone;
    this.description = data.description;
    this.photoUrl = data.photoUrl;
    this.hours = data.hours;
    this.createdAt = data.createdAt || admin.firestore.Timestamp.now();
  }

  // If you need to add a method to convert a plain object to the class instance
  static fromData(data) {
    // Handle the conversion from plain
    // object to Firestore GeoPoint if necessary
    if (data.location && !(data.location instanceof admin.firestore.GeoPoint)) {
      data.location = new admin.firestore.GeoPoint(
          data.location.latitude,
          data.location.longitude,
      );
    }
    return new Pub(data);
  }
}

module.exports = Pub;
