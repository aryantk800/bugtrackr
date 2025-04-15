import React, { useState, useEffect } from 'react';
import { db, functions } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';

const BugForm = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignMode, setAssignMode] = useState('auto');
  const [assignTo, setAssignTo] = useState('');
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
        .filter(u => u.uid !== user.uid);
      setUsersList(users);
    };

    if (user) fetchUsers();
  }, [user]);

  const autoAssignUser = () => {
    const sorted = [...usersList].sort((a, b) => a.assignedBugCount - b.assignedBugCount);
    return sorted.length > 0 ? sorted[0] : null;
  };

  const notifyByEmail = async ({ to, subject, message }) => {
    try {
      const sendBugNotification = httpsCallable(functions, 'sendBugNotification');
      await sendBugNotification({ to, subject, message });
    } catch (error) {
      console.error('Email notification error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    let assignedUser = null;

    if (assignMode === 'manual') {
      if (assignTo === 'self') {
        assignedUser = { uid: user.uid, email: user.email, assignedBugCount: 0 };
      } else {
        assignedUser = usersList.find(u => u.uid === assignTo);
      }
    } else {
      if (usersList.length === 1) {
        assignedUser = { uid: user.uid, email: user.email, assignedBugCount: 0 };
      } else {
        assignedUser = autoAssignUser();
      }
    }

    if (!assignedUser || !assignedUser.email) {
      assignedUser = { uid: user.uid, email: user.email, assignedBugCount: 0 };
    }

    try {
      await addDoc(collection(db, 'bugs'), {
        title,
        description,
        priority,
        status: 'open',
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        assignedTo: assignedUser.uid,
        assignedEmail: assignedUser.email,
        userId: user.uid,
      });

      if (assignedUser.uid !== user.uid) {
        await updateDoc(doc(db, 'users', assignedUser.uid), {
          assignedBugCount: increment(1)
        });
      }

      await notifyByEmail({
        to: assignedUser.email,
        subject: `🐞 New Bug Assigned: ${title}`,
        message: `Hi ${assignedUser.email},\n\nYou’ve been assigned a new bug titled "${title}".`
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssignTo('');
      alert(`🐞 Bug submitted and assigned to: ${assignedUser.email}`);
    } catch (err) {
      console.error('Error submitting bug:', err);
      alert('Error submitting bug.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded shadow">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Report a Bug</h2>

      <input
        type="text"
        placeholder="Bug title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full dark:bg-gray-800 dark:text-white"
        required
      />

      <textarea
        placeholder="Bug description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full dark:bg-gray-800 dark:text-white"
        required
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border p-2 w-full dark:bg-gray-800 dark:text-white"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <div className="space-y-2">
        <label className="block font-medium dark:text-white">Assign To</label>
        <select
          value={assignMode}
          onChange={(e) => setAssignMode(e.target.value)}
          className="border p-2 w-full dark:bg-gray-800 dark:text-white"
        >
          <option value="auto">Auto Assign</option>
          <option value="manual">Manual Assign</option>
        </select>

        {assignMode === 'manual' && (
          <select
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            className="border p-2 w-full dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select user</option>
            {usersList.map(u => (
              <option key={u.uid} value={u.uid}>
                {u.email} ({u.role})
              </option>
            ))}
            <option value="self">Assign to Myself</option>
          </select>
        )}
      </div>

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Submit Bug
      </button>
    </form>
  );
};

export default BugForm;
