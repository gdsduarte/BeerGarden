/* Not in use */

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

  addMessage: async (chatId, message) => {
    try {
      const db = firebase.firestore();
      await db.collection('chats').doc(chatId).collection('messages').add(message);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  getMessages: async chatId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('chats').doc(chatId).collection('messages').get();
      return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  addChat: async chat => {
    try {
      const db = firebase.firestore();
      const docRef = await db.collection('chats').add(chat);
      return docRef.id;
    } catch (error) {
      console.error('Error adding chat:', error);
      throw error;
    }
  },

  getChat: async chatId => {
    try {
      const db = firebase.firestore();
      const doc = await db.collection('chats').doc(chatId).get();
      if (doc.exists) {
        return {id: doc.id, ...doc.data()};
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting chat:', error);
      throw error;
    }
  },

  getChats: async () => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('chats').get();
      return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      console.error('Error getting chats:', error);
      throw error;
    }
  },

  addGroup: async group => {
    try {
      const db = firebase.firestore();
      const docRef = await db.collection('groups').add(group);
      return docRef.id;
    } catch (error) {
      console.error('Error adding group:', error);
      throw error;
    }
  },

  getGroup: async groupId => {
    try {
      const db = firebase.firestore();
      const doc = await db.collection('groups').doc(groupId).get();
      if (doc.exists) {
        return {id: doc.id, ...doc.data()};
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting group:', error);
      throw error;
    }
  },

  getGroups: async () => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('groups').get();
      return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      console.error('Error getting groups:', error);
      throw error;
    }
  },

  addGroupMessage: async (groupId, message) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('messages').add(message);
    } catch (error) {
      console.error('Error adding group message:', error);
      throw error;
    }
  },

  getGroupMessages: async groupId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('groups').doc(groupId).collection('messages').get();
      return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      console.error('Error getting group messages:', error);
      throw error;
    }
  },

  addGroupMember: async (groupId, memberId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('members').doc(memberId).set({});
    } catch (error) {
      console.error('Error adding group member:', error);
      throw error;
    }
  },

  getGroupMembers: async groupId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('groups').doc(groupId).collection('members').get();
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error getting group members:', error);
      throw error;
    }
  },

  addGroupAdmin: async (groupId, adminId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('admins').doc(adminId).set({});
    } catch (error) {
      console.error('Error adding group admin:', error);
      throw error;
    }
  },

  getGroupAdmins: async groupId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('groups').doc(groupId).collection('admins').get();
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error getting group admins:', error);
      throw error;
    }
  },

  addGroupRequest: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('requests').doc(userId).set({});
    } catch (error) {
      console.error('Error adding group request:', error);
      throw error;
    }
  },

  getGroupRequests: async groupId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('groups').doc(groupId).collection('requests').get();
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error getting group requests:', error);
      throw error;
    }
  },

  addGroupInvite: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('invites').doc(userId).set({});
    } catch (error) {
      console.error('Error adding group invite:', error);
      throw error;
    }
  },

  getGroupInvites: async groupId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('groups').doc(groupId).collection('invites').get();
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error getting group invites:', error);
      throw error;
    }
  },

  addFriend: async (userId, friendId) => {
    try {
      const db = firebase.firestore();
      await db.collection('user').doc(userId).collection('friends').doc(friendId).set({});
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  },

  getFriends: async userId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('user').doc(userId).collection('friends').get();
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error getting friends:', error);
      throw error;
    }
  },

  addFriendRequest: async (userId, friendId) => {
    try {
      const db = firebase.firestore();
      await db.collection('user').doc(userId).collection('requests').doc(friendId).set({});
    } catch (error) {
      console.error('Error adding friend request:', error);
      throw error;
    }
  },

  getFriendRequests: async userId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('user').doc(userId).collection('requests').get();
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error getting friend requests:', error);
      throw error;
    }
  },

  addFriendInvite: async (userId, friendId) => {
    try {
      const db = firebase.firestore();
      await db.collection('user').doc(userId).collection('invites').doc(friendId).set({});
    } catch (error) {
      console.error('Error adding friend invite:', error);
      throw error;
    }
  },

  getFriendInvites: async userId => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('user').doc(userId).collection('invites').get();
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error getting friend invites:', error);
      throw error;
    }
  },

  addFriendToGroup: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('members').doc(userId).set({});
    } catch (error) {
      console.error('Error adding friend to group:', error);
      throw error;
    }
  },

  removeFriendFromGroup: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('members').doc(userId).delete();
    } catch (error) {
      console.error('Error removing friend from group:', error);
      throw error;
    }
  },

  addAdminToGroup: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('admins').doc(userId).set({});
    } catch (error) {
      console.error('Error adding admin to group:', error);
      throw error;
    }
  },

  removeAdminFromGroup: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('admins').doc(userId).delete();
    } catch (error) {
      console.error('Error removing admin from group:', error);
      throw error;
    }
  },

  addRequestToGroup: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('requests').doc(userId).set({});
    } catch (error) {
      console.error('Error adding request to group:', error);
      throw error;
    }
  },

  removeRequestFromGroup: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('requests').doc(userId).delete();
    } catch (error) {
      console.error('Error removing request from group:', error);
      throw error;
    }
  },

  addInviteToGroup: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('invites').doc(userId).set({});
    } catch (error) {
      console.error('Error adding invite to group:', error);
      throw error;
    }
  },

  removeInviteFromGroup: async (groupId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('groups').doc(groupId).collection('invites').doc(userId).delete();
    } catch (error) {
      console.error('Error removing invite from group:', error);
      throw error;
    }
  },

  addFriendToChat: async (chatId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('chats').doc(chatId).collection('members').doc(userId).set({});
    } catch (error) {
      console.error('Error adding friend to chat:', error);
      throw error;
    }
  },

  removeFriendFromChat: async (chatId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('chats').doc(chatId).collection('members').doc(userId).delete();
    } catch (error) {
      console.error('Error removing friend from chat:', error);
      throw error;
    }
  },

  addAdminToChat: async (chatId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('chats').doc(chatId).collection('admins').doc(userId).set({});
    } catch (error) {
      console.error('Error adding admin to chat:', error);
      throw error;
    }
  },

  removeAdminFromChat: async (chatId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('chats').doc(chatId).collection('admins').doc(userId).delete();
    } catch (error) {
      console.error('Error removing admin from chat:', error);
      throw error;
    }
  },

  addRequestToChat: async (chatId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('chats').doc(chatId).collection('requests').doc(userId).set({});
    } catch (error) {
      console.error('Error adding request to chat:', error);
      throw error;
    }
  },

  removeRequestFromChat: async (chatId, userId) => {
    try {
      const db = firebase.firestore();
      await db.collection('chats').doc(chatId).collection('requests').doc(userId).delete();
    } catch (error) {
      console.error('Error removing request from chat:', error);
      throw error;
    }
  },

};

export default firestoreService;
