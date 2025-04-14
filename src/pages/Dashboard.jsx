import React from 'react';
import Navbar from '../components/Navbar';
import BugForm from '../components/BugForm';
import BugList from '../components/BugList';
import BugStats from '../components/BugStats';
import BugTrendChart from '../components/BugTrendChart';
import SmartSuggestions from '../components/SmartSuggestions';
import ProfileWidget from '../components/ProfileWidget';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar: Navbar + Profile */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between">
        <div>
          <Navbar />
        </div>
        <div className="p-4">
          <ProfileWidget />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-3 space-y-12">
            {/* Header */}
            <header>
              <h1 className="text-4xl font-bold mb-2">🐞 BugTrackr Dashboard</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Track, manage, and squash bugs effectively!
              </p>
            </header>

            {/* Bug Submission */}
            <section aria-labelledby="bug-form-heading">
              <h2 id="bug-form-heading" className="text-2xl font-semibold mb-4">
                Submit a New Bug
              </h2>
              <BugForm />
            </section>

            {/* Stats and Trends */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div aria-labelledby="bug-stats-heading">
                <h2 id="bug-stats-heading" className="text-2xl font-semibold mb-4">
                  Bug Summary
                </h2>
                <BugStats />
              </div>
              <div aria-labelledby="trend-heading">
                <h2 id="trend-heading" className="text-2xl font-semibold mb-4">
                  Bug Submission Trends
                </h2>
                <BugTrendChart />
              </div>
            </section>

            {/* Bug List */}
            <section aria-labelledby="bug-list-heading">
              <h2 id="bug-list-heading" className="text-2xl font-semibold mb-4">
                Your Reported Bugs
              </h2>
              <BugList />
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <SmartSuggestions />
          </aside>
        </div>
      </main>
    </div>
  );
}
