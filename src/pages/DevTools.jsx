import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { serverTimestamp } from 'firebase/firestore';

export default function DevTools() {
  const { user } = useAuth();
  const [isAllowed, setIsAllowed] = useState(false);
  const [status, setStatus] = useState(null);

  // 🔐 Replace with your actual UID
  const YOUR_UID = 'your-actual-uid-here';

  useEffect(() => {
    if (user?.uid === YOUR_UID) {
      setIsAllowed(true);
    }
  }, [user]);

  const handleBackfill = async () => {
    setStatus('Processing...');
    try {
      const snapshot = await getDocs(collection(db, 'bugs'));
      const updates = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data.createdAt || !data.createdBy) {
          updates.push(
            updateDoc(doc(db, 'bugs', docSnap.id), {
              createdAt: serverTimestamp(),
              createdBy: user.uid,
            })
          );
        }
      });

      await Promise.all(updates);
      setStatus(`✅ Backfilled ${updates.length} bug(s)`);
    } catch (err) {
      console.error('Backfill error:', err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  if (!user) return <p className="p-4">Please log in...</p>;
  if (!isAllowed) return <p className="p-4">⛔ Not authorized to access DevTools.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🛠️ Developer Tools</h1>
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        Only visible to authorized users. Use with caution.
      </p>

      <button
        onClick={handleBackfill}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        🔄 Backfill Missing Fields
      </button>

      {status && <p className="mt-4 text-sm text-gray-800 dark:text-gray-200">{status}</p>}
    </div>
  );
}
