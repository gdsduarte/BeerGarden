/* eslint-disable prettier/prettier */
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const firestoreService = {
  checkUsernameExists: async username => {
    const userRef = firebase.firestore().collection('user');
    const snapshot = await userRef.where('username', '==', username).get();
    return !snapshot.empty;
  },

  checkEmailExists: async email => {
    const userRef = firebase.firestore().collection('user');
    const snapshot = await userRef.where('email', '==', email).get();
    return !snapshot.empty;
  },

  addUser: async (uid, user) => {
    try {
      const db = firebase.firestore();
      await db.collection('user').doc(uid).set(user);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  getUser: async uid => {
    try {
      const db = firebase.firestore();
      const docRef = await db.collection('user').doc(uid).get();
      if (docRef.exists) {
        return {id: docRef.id, ...docRef.data()};
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  addPub: async pub => {
    try {
      const db = firebase.firestore();
      const docRef = await db.collection('pubs').add(pub);
      return docRef.id;
    } catch (error) {
      console.error('Error adding pub:', error);
      throw error;
    }
  },

  createDocument: async (collection, data) => {
    try {
      const db = firebase.firestore();
      const docRef = await db.collection(collection).add(data);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collection}:`, error);
      throw error;
    }
  },

  getDocument: async (collection, docId) => {
    try {
      const db = firebase.firestore();
      const doc = await db.collection(collection).doc(docId).get();
      if (doc.exists) {
        return {id: doc.id, ...doc.data()};
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document from ${collection}:`, error);
      throw error;
    }
  },

  getDocuments: async collection => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection(collection).get();
      return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      console.error(`Error getting documents from ${collection}:`, error);
      throw error;
    }
  },

  updateDocument: async (collection, docId, data) => {
    try {
      const db = firebase.firestore();
      await db.collection(collection).doc(docId).update(data);
    } catch (error) {
      console.error(`Error updating document in ${collection}:`, error);
      throw error;
    }
  },

  deleteDocument: async (collection, docId) => {
    try {
      const db = firebase.firestore();
      await db.collection(collection).doc(docId).delete();
    } catch (error) {
      console.error(`Error deleting document from ${collection}:`, error);
      throw error;
    }
  },
};

export default firestoreService;
