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

// 🔧 Helper: Get past N dates in 'YYYY-MM-DD' format
function getPastNDates(n) {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const iso = date.toISOString().split('T')[0];
    dates.push(iso);
  }
  return dates;
}

export default function BugTrendChart() {
  const { user } = useAuth();
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const numberOfDays = 14;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'bugs'), where('createdBy', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bugData = snapshot.docs.map((doc) => doc.data());
      const counts = {};

      bugData.forEach((bug) => {
        const timestamp = bug.createdAt?.toDate?.();
        if (timestamp) {
          const date = timestamp.toISOString().split('T')[0];
          counts[date] = (counts[date] || 0) + 1;
        }
      });

      const days = getPastNDates(numberOfDays);
      const filledData = days.map((date) => ({
        date,
        count: counts[date] || 0,
      }));

      setTrendData(filledData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-300">Loading trend data...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-8">
      <h2 className="text-lg font-bold mb-4">📈 Bug Submission Trend (Last {numberOfDays} Days)</h2>
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
