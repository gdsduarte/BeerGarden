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

export const AuthProvider = ({children}) => {
  const [state, setState] = useState({
    isLoading: true,
    isUserLoggedIn: null,
    currentUserId: null,
    userRole: null,
  });

  // Fetch user role from Firestore based on userID
  const fetchUserRole = async uid => {
    const userDoc = await firestore().collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data().role;
    }
    return 'user'; // Default role
  };

  const onAuthStateChanged = useCallback(async user => {
    if (user) {
      const role = await fetchUserRole(user.uid);
      setState({
        isLoading: false,
        isUserLoggedIn: true,
        currentUserId: user.uid,
        userRole: role,
      });
    } else {
      setState(s => ({
        ...s,
        isLoading: false,
        isUserLoggedIn: false,
        currentUserId: null,
        userRole: null,
      }));
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
      // Optionally set user role state here, if needed immediately post-sign-up
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
