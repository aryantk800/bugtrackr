// src/context/AuthContext.jsx
import React, { useContext, useEffect, useState, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
