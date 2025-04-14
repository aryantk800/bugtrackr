// src/components/SmartSuggestions.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function SmartSuggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'bugs'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bugTitles = snapshot.docs.map((doc) => doc.data().title.toLowerCase());
      const keywordCount = {};

      bugTitles.forEach((title) => {
        const words = title.split(' ');
        words.forEach((word) => {
          if (word.length > 3) {
            keywordCount[word] = (keywordCount[word] || 0) + 1;
          }
        });
      });

      const commonKeywords = Object.entries(keywordCount)
        .filter(([, count]) => count > 2)
        .map(([word]) => `You’ve reported several bugs related to “${word}” — consider reviewing that area.`);

      setSuggestions(commonKeywords.slice(0, 3));
    });

    return () => unsubscribe();
  }, [user]);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 p-4 rounded-xl mb-8">
      <h2 className="text-lg font-bold mb-2">🧠 Smart Suggestions</h2>
      <ul className="list-disc pl-5">
        {suggestions.map((sug, i) => (
          <li key={i}>{sug}</li>
        ))}
      </ul>
    </div>
  );
}
