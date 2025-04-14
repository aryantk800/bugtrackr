import React, { useContext, useEffect, useState, createContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // ✅ Make sure db is exported from firebase.js

const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

// ✅ Helper to save new users to Firestore
async function saveUserToFirestore(user) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      role: 'developer',         // Default role
      assignedBugCount: 0,       // Default assigned count
    });
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await saveUserToFirestore(firebaseUser); // ✅ Ensure user is saved in Firestore
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, auth, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
