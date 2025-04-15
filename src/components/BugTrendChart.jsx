// src/components/BugTrendChart.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

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
  const [days, setDays] = useState(14); // 🔧 Selectable date range
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'

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

      const daysArray = getPastNDates(days);
      const filled = daysArray.map((date) => ({
        date,
        count: counts[date] || 0,
      }));

      setTrendData(filled);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, days]);

  const totalCount = trendData.reduce((acc, day) => acc + day.count, 0);

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-300">Loading trend data...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📈 Bug Submission Trend</h2>
        <div className="flex items-center space-x-2 text-sm">
          <span>Total: <strong>{totalCount}</strong></span>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-gray-100 dark:bg-gray-700 dark:text-white border rounded px-2 py-1"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
          <button
            onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            {chartType === 'line' ? 'Switch to Bar 📊' : 'Switch to Line 📈'}
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        {chartType === 'line' ? (
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        ) : (
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
