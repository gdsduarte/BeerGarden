/* eslint-disable linebreak-style */
/* eslint-disable quotes */
const admin = require("firebase-admin");
const db = admin.firestore();

const addDocument = async (collection, data) => {
  const docRef = await db.collection(collection).add(data);
  return docRef.id;
};

const updateDocument = async (collection, docId, data) => {
  await db.collection(collection).doc(docId).update(data);
};

const deleteDocument = async (collection, docId) => {
  await db.collection(collection).doc(docId).delete();
};

const getDocument = async (collection, docId) => {
  const doc = await db.collection(collection).doc(docId).get();
  if (!doc.exists) {
    throw new Error("Document not found");
  }
  return {id: doc.id, ...doc.data()};
};

const getDocuments = async (collection) => {
  const snapshot = await db.collection(collection).get();
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
};

module.exports = {
  addDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  getDocuments,
};
