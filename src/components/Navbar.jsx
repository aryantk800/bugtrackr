import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="h-full bg-gray-800 text-white w-64 p-6 flex flex-col">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">🐞 BugTrackr</h1>

        <Link
          to="/dashboard"
          className="block hover:bg-gray-700 p-2 rounded"
        >
          Dashboard
        </Link>
        <Link
          to="/settings"
          className="block hover:bg-gray-700 p-2 rounded"
        >
          Settings
        </Link>

        {/* ✅ Logout moved below navigation links */}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded text-left"
        >
          Logout
        </button>
      </div>

      {/* Optional footer or version info can go here */}
      <div className="mt-auto text-sm text-gray-400 pt-6">
        Logged in as: <br />
        <span className="break-words">{user?.email || 'Unknown User'}</span>
      </div>
    </nav>
  );
}
