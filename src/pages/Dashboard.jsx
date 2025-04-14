// src/pages/Dashboard.jsx
import React from 'react';
import BugForm from '../components/BugForm';
import BugList from '../components/BugList';

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">🐞 BugTrackr Dashboard</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Track, manage, and squash bugs effectively!
          </p>
        </header>

        <section className="mb-12" aria-labelledby="bug-form-heading">
          <h2 id="bug-form-heading" className="text-2xl font-semibold mb-4">
            Submit a New Bug
          </h2>
          <BugForm />
        </section>

        <section aria-labelledby="bug-list-heading">
          <h2 id="bug-list-heading" className="text-2xl font-semibold mb-4">
            Your Reported Bugs
          </h2>
          <BugList />
        </section>
      </div>
    </main>
  );
}
