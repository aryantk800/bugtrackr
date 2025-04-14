import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function BugStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    highPriority: 0,
  });

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'bugs'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bugData = snapshot.docs.map(doc => doc.data());

      const total = bugData.length;
      const open = bugData.filter(b => b.status === 'open').length;
      const resolved = bugData.filter(b => b.status === 'resolved').length;
      const highPriority = bugData.filter(b => b.priority === 'high').length;

      setStats({ total, open, resolved, highPriority });
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <StatCard label="Total" value={stats.total} color="bg-blue-600" emoji="🔢" />
      <StatCard label="Open" value={stats.open} color="bg-green-600" emoji="🟢" />
      <StatCard label="Resolved" value={stats.resolved} color="bg-red-600" emoji="🔴" />
      <StatCard label="High Priority" value={stats.highPriority} color="bg-yellow-500" emoji="🔥" />
    </div>
  );
}

function StatCard({ label, value, color, emoji }) {
  return (
    <div className={`rounded-xl p-4 shadow-md text-white ${color} flex items-center justify-between`}>
      <div>
        <div className="text-sm opacity-80">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="text-3xl">{emoji}</div>
    </div>
  );
}
