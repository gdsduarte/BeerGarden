/* eslint-disable prettier/prettier */
import React, { createContext, useState } from 'react';

const AuthContext = createContext({
  currentUserId: null,
  setCurrentUserId: () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);

  //const signIn = async () => { /* ... */ };
  //const signOut = async () => { /* ... */ };

  return (
    <AuthContext.Provider value={{ currentUserId, setCurrentUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;