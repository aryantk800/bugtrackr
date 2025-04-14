import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function NewBugForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert('Title and Description are required.');

    await addDoc(collection(db, 'bugs'), {
      userId: user.uid,
      title,
      description,
      status,
      priority,
      createdAt: Timestamp.now(),
    });

    // Reset form
    setTitle('');
    setDescription('');
    setStatus('open');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow mt-4">
      <h2 className="text-lg font-semibold">Report a New Bug</h2>
      <input
        type="text"
        placeholder="Bug Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-700"
      />
      <textarea
        placeholder="Bug Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-700"
      />
      <div className="flex gap-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded border dark:bg-gray-700">
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-2 rounded border dark:bg-gray-700">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Bug</button>
    </form>
  );
}
