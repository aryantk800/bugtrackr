import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function BugList() {
  const { user } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [filter, setFilter] = useState(null); // Start as null while loading
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBug, setSelectedBug] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch bugs and user preferences
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // 1. Fetch user preferences
        const prefDoc = await getDoc(doc(db, 'userPreferences', user.uid));
        const userPrefs = prefDoc.exists() ? prefDoc.data() : {};
        setFilter(userPrefs.bugFilterDefault?.toLowerCase() || 'all');

        // 2. Set up real-time bug listener
        const q = query(collection(db, 'bugs'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const bugData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setBugs(bugData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading bugs or preferences:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleResolve = async (id) => {
    const bugRef = doc(db, 'bugs', id);
    await updateDoc(bugRef, { status: 'resolved' });
  };

  const handleDelete = async (id) => {
    const bugRef = doc(db, 'bugs', id);
    await deleteDoc(bugRef);
    setSelectedBug(null);
  };

  const filteredBugs = bugs
    .filter((bug) => filter === 'all' || bug.status === filter)
    .filter(
      (bug) =>
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading || filter === null) {
    return <div className="p-6 text-gray-600 dark:text-gray-300">Loading bugs...</div>;
  }

  return (
    <div>
      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search bugs..."
        className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['all', 'open', 'resolved'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bug Cards */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {filteredBugs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No bugs found.</p>
        ) : (
          filteredBugs.map((bug) => (
            <div
              key={bug.id}
              onClick={() => setSelectedBug(bug)}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 border-l-4 transition-all border-blue-400 cursor-pointer hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold">{bug.title}</h3>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    bug.status === 'resolved'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {bug.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">{bug.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Submitted on {new Date(bug.createdAt?.toDate()).toLocaleString()}
              </p>

              <div className="mt-4 flex space-x-2">
                {bug.status === 'open' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolve(bug.id);
                    }}
                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-full"
                  >
                    Mark as Resolved
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(bug.id);
                  }}
                  className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bug Detail Modal */}
      <Dialog open={!!selectedBug} onOpenChange={(open) => !open && setSelectedBug(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBug?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-sm">{selectedBug?.description}</p>
            <p className="text-sm">
              <strong>Status:</strong>{' '}
              <span
                className={`px-2 py-1 rounded text-white text-xs ${
                  selectedBug?.status === 'resolved' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {selectedBug?.status}
              </span>
            </p>
            <p className="text-sm">
              <strong>Priority:</strong> {selectedBug?.priority || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Submitted:</strong>{' '}
              {selectedBug?.createdAt?.toDate().toLocaleString()}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBug(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
