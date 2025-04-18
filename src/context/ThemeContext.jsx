import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Load theme from Firebase (or fallback) when user changes
  useEffect(() => {
    const loadTheme = async () => {
      setLoading(true);

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const storedTheme = docSnap.data().theme;
          setTheme(storedTheme || 'light');
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const fallback = prefersDark ? 'dark' : 'light';
          setTheme(fallback);
          await setDoc(userRef, { theme: fallback }, { merge: true });
        }
      } else {
        const localTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(localTheme || (prefersDark ? 'dark' : 'light'));
      }

      setLoading(false);
    };

    loadTheme();
  }, [user]);

  // Apply theme to DOM & persist to Firestore (if user)
  useEffect(() => {
    if (loading) return;

    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, { theme }, { merge: true });
    }
  }, [theme, user, loading]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (loading) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
