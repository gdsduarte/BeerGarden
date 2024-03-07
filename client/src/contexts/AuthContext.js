/* eslint-disable prettier/prettier */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const fetchUserRole = async (uid) => {
  // Attempt to fetch from the 'users' collection first
  let doc = await firestore().collection('users').doc(uid).get();
  if (doc.exists) {
    return { role: 'user', data: doc.data() }; // Assuming 'user' is the role
  } else {
    // If not found, attempt to fetch from the 'pubs' collection
    doc = await firestore().collection('pubs').doc(uid).get();
    if (doc.exists) {
      return { role: 'pub', data: doc.data() }; // Assuming 'pub' is the role for pub owners
    }
  }
  return { role: null, data: null }; // Default to null if not found in both
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isLoading: true,
    isUserLoggedIn: false,
    currentUserId: null,
    userRole: null,
    userData: null, // Store additional user data fetched from Firestore
  });

  /* const onAuthStateChanged = useCallback(async (user) => {
    if (user) {
      const { role, data } = await fetchUserRole(user.uid);
      setState({
        isLoading: false,
        isUserLoggedIn: true,
        currentUserId: user.uid,
        userRole: role,
        userData: data,
      });
    } else {
      setState((s) => ({
        ...s,
        isLoading: false,
        isUserLoggedIn: false,
        currentUserId: null,
        userRole: null,
        userData: null,
      }));
    }
  }, []); */

  const onAuthStateChanged = useCallback(async (user) => {
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
        userRole: userData.role, // Use the role from the document
        userData,
      });
    } else {
      // User is not logged in
      setState((s) => ({ ...s, isLoading: false, isUserLoggedIn: false }));
    }
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
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
