// src/components/BugTrendChart.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function BugTrendChart() {
  const { user } = useAuth();
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'bugs'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bugData = snapshot.docs.map((doc) => doc.data());
      const counts = {};

      bugData.forEach((bug) => {
        const date = bug.createdAt?.toDate().toISOString().split('T')[0];
        if (date) counts[date] = (counts[date] || 0) + 1;
      });

      const formatted = Object.entries(counts).map(([date, count]) => ({ date, count }));
      setTrendData(formatted);
    });

    return () => unsubscribe();
  }, [user]);

  if (trendData.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-8">
      <h2 className="text-lg font-bold mb-4">📈 Bug Submission Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}