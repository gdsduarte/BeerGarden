/* eslint-disable prettier/prettier */
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const authService = {

  checkUserAuthentication: (setIsUserLoggedIn, setIsLoading) => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
      setIsLoading(false);
      return user;
    });
    return unsubscribe;
  },

  signUp: async (email, password) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  },

  signOut: async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await firebase.auth().signInWithPopup(provider);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  sendEmailVerification: async (user) => {
    try {
      await user.sendEmailVerification();
    } catch (error) {
      throw error;
    }
    return user;
  },

  updateProfile: async (user, data) => {
    try {
      await user.updateProfile(data);
    } catch (error) {
      throw error;
    }
    return user;
  },
};

export default authService;
