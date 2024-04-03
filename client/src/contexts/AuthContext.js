/**
 * Auth Context Manager is responsible for managing the auth state of the application.
 * 
 * It contains the following features:
 * - The Auth Provider Component is responsible for managing the auth state.
 * - The Custom Hook useAuth is used to access the Auth Context.
 * - The Auth Provider Component is used to wrap the application with the Auth Context.
 * - The Auth State Change Handler is used to handle the current user's auth state.
 * - The Firestore Auth State Listener is used to listen for changes in the auth state.
 * - The Sign-Up Method is used to sign up a new user with email and password.
 * - The Sign-In Method is used to sign in a user with email and password.
 * - The Sign-Out Method is used to sign out the current user.
 */

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Auth Context Manager
const AuthContext = createContext();

// Custom Hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component is responsible for managing the auth state
export const AuthProvider = ({children}) => {
  const [state, setState] = useState({
    isLoading: true,
    isUserLoggedIn: false,
    currentUserId: null,
    userRole: null,
    userData: null,
  });

  // Auth State Change Handler for current user
  const onAuthStateChanged = useCallback(async user => {
    if (user) {
      // Attempt to fetch the user document from either the 'users' or 'pubs' collection
      let doc = await firestore().collection('user').doc(user.uid).get();
      if (!doc.exists) {
        doc = await firestore().collection('pub').doc(user.uid).get();
      }
      const userData = doc.data();
      setState({
        isLoading: false,
        isUserLoggedIn: true,
        currentUserId: user.uid,
        userRole: userData.role,
        userData,
      });
    } else {
      // User is not logged in
      setState(s => ({...s, isLoading: false, isUserLoggedIn: false}));
    }
  }, []);

  // Firestore Auth State Listener
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);

  // Sign-Up Method
  const signUp = async (email, password, userData = {}) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const {user} = userCredential;
      await firestore().collection('users').doc(user.uid).set(userData);
      await user.sendEmailVerification();
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Sign-In Method
  const signIn = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign-Out Method
  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{...state, signUp, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
