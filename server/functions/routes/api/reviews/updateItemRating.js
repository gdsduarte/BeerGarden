/* eslint-disable linebreak-style */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const updateItemRating = functions.firestore
    .document("reviews/{reviewId}")
    .onWrite((change, context) => {
    // Get the itemId and rating from the review document
      const reviewData = change.after.exists ? change.after.data() : null;
      const itemId = reviewData.itemId;

      // Reference to the menu item
      const itemRef = admin.firestore().collection("foods").doc(itemId);

      // Get all reviews for the item
      return admin
          .firestore()
          .collection("reviews")
          .where("itemId", "==", itemId)
          .get()
          .then((querySnapshot) => {
            let ratingSum = 0;
            querySnapshot.forEach((doc) => {
              ratingSum += doc.data().rating;
            });

            // Calculate new average rating and update item
            const averageRating = ratingSum / querySnapshot.size;
            return itemRef.update({
              rating: averageRating,
              reviewCount: querySnapshot.size,
            });
          });
    });

module.exports = updateItemRating;
