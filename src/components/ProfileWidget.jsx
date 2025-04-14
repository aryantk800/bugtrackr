import React from 'react';
import { useAuth } from '../context/AuthContext'; // assuming you're using context
import { Pencil } from 'lucide-react';

export default function ProfileWidget() {
  const { user } = useAuth(); // contains user.email, maybe displayName/photoURL

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-72">
      <div className="flex flex-col items-center text-center space-y-4">
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=0D8ABC&color=fff`}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">{user?.displayName || 'BugTrackr User'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <span className="mt-1 inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
            Developer
          </span>
        </div>
        <button className="mt-3 inline-flex items-center gap-1 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">
          <Pencil className="w-4 h-4" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}
