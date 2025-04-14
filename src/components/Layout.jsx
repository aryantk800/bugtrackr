import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <Navbar />
      </aside>

      {/* Main content with slight gap from sidebar */}
      <main className="flex-1 w-full h-full overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pl-4 pr-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
