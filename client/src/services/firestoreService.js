/* eslint-disable prettier/prettier */
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const firestoreService = {
  // Add a user to the database
  async addUser(uid, user) {
    const db = firebase.firestore();
    await db.collection('users').doc(uid).set(user);
  },

  // Get a user from the database
  async getUser(uid) {
    const db = firebase.firestore();
    const docRef = await db.collection('users').doc(uid).get();
    if (docRef.exists) {
      return { id: docRef.id,...docRef.data() };
    } else {
      return null;
    }
  },

  // Add a pub to the database
  async addPub(pub) {
    const db = firebase.firestore();
    const docRef = await db.collection('pubs').add(pub);
    return docRef.id;
  },

  // Create a new document in a collection
  async createDocument(collection, data) {
    const db = firebase.firestore();
    const docRef = await db.collection(collection).add(data);
    return docRef.id;
  },

  // Read a document from a collection
  async getDocument(collection, docId) {
    const db = firebase.firestore();
    const doc = await db.collection(collection).doc(docId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  },

  // Read all documents from a collection
  async getDocuments(collection) {
    const db = firebase.firestore();
    const snapshot = await db.collection(collection).get();
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return docs;
  },

  // Update a document in a collection
  async updateDocument(collection, docId, data) {
    const db = firebase.firestore();
    await db.collection(collection).doc(docId).update(data);
  },

  // Delete a document from a collection
  async deleteDocument(collection, docId) {
    const db = firebase.firestore();
    await db.collection(collection).doc(docId).delete();
  },
};

export default firestoreService;
