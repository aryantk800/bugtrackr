import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Switch from '@/components/ui/Switch'; // ✅ Fixed import
import { Button } from '@/components/ui/button';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function SettingsPanel({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [defaultFilter, setDefaultFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const loadPrefs = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDefaultFilter(data.defaultFilter || 'all');
        if (data.theme && data.theme !== theme) toggleTheme();
      }
    };
    loadPrefs();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, {
      defaultFilter,
      theme,
    }, { merge: true });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute top-4 right-4 z-10">
          ⚙️ Settings
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Preferences</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Dark Mode</label>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>

          <div>
            <label className="text-sm font-medium">Default Bug Filter</label>
            <select
              value={defaultFilter}
              onChange={(e) => setDefaultFilter(e.target.value)}
              className="w-full mt-1 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
