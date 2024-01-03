/* eslint-disable prettier/prettier */
import React, { createContext, useState } from 'react';

const AuthContext = createContext({
  currentUserUID: null,
  setCurrentUserUID: () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUserUID, setCurrentUserUID] = useState(null);

  //const signIn = async () => { /* ... */ };
  //const signOut = async () => { /* ... */ };

  return (
    <AuthContext.Provider value={{ currentUserUID, setCurrentUserUID }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;