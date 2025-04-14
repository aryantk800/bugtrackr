import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth'; // We'll create this in a moment

const BugForm = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    try {
      await addDoc(collection(db, 'bugs'), {
        title,
        description,
        priority,
        status: 'open',
        createdAt: serverTimestamp(),
        userId: user.uid,
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      alert('Bug submitted!');
    } catch (error) {
      console.error('Error adding bug:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Report a Bug</h2>
      <input
        type="text"
        placeholder="Bug title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <textarea
        placeholder="Bug description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Bug
      </button>
    </form>
  );
};

export default BugForm;
