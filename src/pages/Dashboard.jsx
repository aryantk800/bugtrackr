import React, { useEffect, useState } from 'react';
import BugForm from '../components/BugForm';
import BugList from '../components/BugList';
import BugStats from '../components/BugStats';
import BugTrendChart from '../components/BugTrendChart';
import SmartSuggestions from '../components/SmartSuggestions';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // 🔔
import 'react-toastify/dist/ReactToastify.css'; // 🔔

export default function Dashboard() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      try {
        const docRef = doc(db, "userPreferences", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prefs = docSnap.data();
          setPreferences(prefs);

          // 🔔 Show welcome toast if notifications are enabled
          if (prefs.notificationsEnabled) {
            toast.success(`Welcome back, ${user.email}! 🔔 Notifications are enabled.`);
          }
        } else {
          setPreferences({ bugFilterDefault: 'All' }); // fallback
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setPreferences({ bugFilterDefault: 'All' }); // fallback on error
      } finally {
        setLoadingPrefs(false);
      }
    };

    fetchPreferences();
  }, [user]);

  if (loadingPrefs || !preferences) {
    return <div className="p-6 text-gray-600 dark:text-gray-300">Loading preferences...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-12">
          <header>
            <h1 className="text-4xl font-bold mb-2">🐞 BugTrackr Dashboard</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Track, manage, and squash bugs effectively!
            </p>
          </header>

          <section aria-labelledby="bug-form-heading">
            <h2 id="bug-form-heading" className="text-2xl font-semibold mb-4">
              Submit a New Bug
            </h2>
            <BugForm />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Bug Summary</h2>
              <BugStats />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Bug Submission Trends</h2>
              <BugTrendChart />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Reported Bugs</h2>
            <BugList initialFilter={preferences.bugFilterDefault || 'All'} />
          </section>
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <SmartSuggestions />
        </aside>
      </div>

      {/* 🔔 Toast container must be rendered once */}
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}
