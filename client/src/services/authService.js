/**
 * This service is used to handle authentication-related operations.
 */

import auth from '@react-native-firebase/auth';

const authService = {
  resetPassword: async email => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  sendEmailVerification: async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.sendEmailVerification();
      } else {
        throw new Error('No authenticated user found.');
      }
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  },

  updateProfile: async data => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updateProfile(data);
      } else {
        throw new Error('No authenticated user found.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Example method for signing in with Google for React Native
  // This requires setting up @react-native-google-signin/google-signin
  signInWithGoogle: async () => {
    // Implementation for React Native will differ from web
    // Ensure you have the correct setup for Google Sign-In in React Native
    try {
      // Example placeholder for the actual Google sign-in process in React Native
      // const { idToken } = await GoogleSignin.signIn();
      // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // return await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },
};

export default authService;
