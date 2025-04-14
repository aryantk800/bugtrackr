import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden p-4 bg-gray-800 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">🐞 BugTrackr</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Nav */}
      <nav
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-6 transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:block`}
      >
        <h1 className="text-2xl font-bold mb-6">🐞 BugTrackr</h1>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="block hover:bg-gray-700 p-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block hover:bg-gray-700 p-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="block w-full text-left hover:bg-red-600 p-2 rounded"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
