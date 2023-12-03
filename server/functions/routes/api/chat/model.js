/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
class Chat {
  constructor(data) {
    this.createdAt = admin.firestore.Timestamp.now();
    this.modifiedAt = admin.firestore.Timestamp.now();
    this.createdBy = data.createdBy;
    this.members = [];
    this.mutedBy = [];
    this.name = data.name;
    this.type = data.type;
    this.lastMessage = {
      messageText: data.lastMessage,
      sentAt: data.sentAt,
      sentBy: data.sentBy,
      readBy: [],
    };
  }

  mute(userId) {
    if (!this.mutedBy.includes(userId)) {
      this.mutedBy.push(userId);
    }
  }

  unmute(userId) {
    this.mutedBy = this.mutedBy.filter((uId) => uId !== userId);
  }
}

module.exports = Chat;
