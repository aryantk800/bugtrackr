// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Dashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [newBug, setNewBug] = useState({ title: '', description: '', priority: 'low' });

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'bugs'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBugs(data);
    });

    return () => unsub();
  }, [user]);

  const addBug = async () => {
    await addDoc(collection(db, 'bugs'), {
      ...newBug,
      status: 'open',
      createdAt: new Date(),
      userId: user.uid,
    });
    setNewBug({ title: '', description: '', priority: 'low' });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🐞 Bug Dashboard</h1>

      {/* Add Bug */}
      <div className="mb-6">
        <input className="border p-2 mr-2" placeholder="Title" value={newBug.title}
               onChange={e => setNewBug({ ...newBug, title: e.target.value })} />
        <input className="border p-2 mr-2" placeholder="Description" value={newBug.description}
               onChange={e => setNewBug({ ...newBug, description: e.target.value })} />
        <select className="border p-2 mr-2" value={newBug.priority}
                onChange={e => setNewBug({ ...newBug, priority: e.target.value })}>
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addBug}>Add Bug</button>
      </div>

      {/* Bug List */}
      <ul>
        {bugs.map(bug => (
          <li key={bug.id} className="border p-3 mb-3 rounded shadow-sm">
            <h2 className="text-lg font-semibold">{bug.title}</h2>
            <p className="text-sm">{bug.description}</p>
            <p>Status: {bug.status}</p>
            <p>Priority: {bug.priority}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
