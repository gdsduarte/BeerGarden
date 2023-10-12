/* eslint-disable prettier/prettier */
import auth from '@react-native-firebase/auth';

const authService = {
  checkUserAuthentication: (callback) => {
    const unsubscribe = auth().onAuthStateChanged(callback);
    return unsubscribe;
  },

  signUp: async (email, password) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      const provider = new auth.GoogleAuthProvider();
      const userCredential = await auth().signInWithPopup(provider);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  sendEmailVerification: async (user) => {
    try {
      await user.sendEmailVerification();
      return user;
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  },

  updateProfile: async (user, data) => {
    try {
      await user.updateProfile(data);
      return user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

export default authService;
