import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import ProfileWidget from "../components/ProfileWidget";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const defaultPrefs = {
    bugFilterDefault: "All",
    notificationsEnabled: true,
    aiSuggestions: true,
  };

  const [preferences, setPreferences] = useState(defaultPrefs);
  const [tempPrefs, setTempPrefs] = useState(defaultPrefs);

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      try {
        const docRef = doc(db, "userPreferences", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPreferences(data);
          setTempPrefs(data);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, [user]);

  const handleSavePreferences = async () => {
    try {
      await setDoc(doc(db, "userPreferences", user.uid), tempPrefs);
      setPreferences(tempPrefs);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const isChanged = useMemo(() => {
    return JSON.stringify(preferences) !== JSON.stringify(tempPrefs);
  }, [preferences, tempPrefs]);

  return (
    <div className="w-full min-h-screen px-6 py-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex justify-center mb-6">
        <ProfileWidget />
      </div>

      <h2 className="text-3xl font-bold mb-2">Settings</h2>
      <p className="text-gray-600 mb-6 dark:text-gray-300">
        Manage your preferences and account settings.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Theme & UI Preferences</h3>
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow">
          <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded text-white transition ${
              theme === "dark" ? "bg-gray-600" : "bg-indigo-600"
            }`}
          >
            {theme === "dark" ? "Disable" : "Enable"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Bug Filter Defaults</h3>
          <select
            value={tempPrefs.bugFilterDefault}
            onChange={(e) =>
              setTempPrefs({ ...tempPrefs, bugFilterDefault: e.target.value })
            }
            className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={tempPrefs.notificationsEnabled}
              onChange={(e) =>
                setTempPrefs({
                  ...tempPrefs,
                  notificationsEnabled: e.target.checked,
                })
              }
            />
            <span>Enable email alerts</span>
          </label>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Smart Suggestions & AI</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={tempPrefs.aiSuggestions}
              onChange={(e) =>
                setTempPrefs({
                  ...tempPrefs,
                  aiSuggestions: e.target.checked,
                })
              }
            />
            <span>Enable smart prioritization</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          disabled={!isChanged}
          className={`px-6 py-2 rounded shadow transition ${
            isChanged
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default Settings;
