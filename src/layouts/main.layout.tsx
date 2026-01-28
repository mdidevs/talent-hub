import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Talent Hub</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-700">
              Profile
            </button>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-gray-900 text-white transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="block px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/talents"
                  className="block px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Talents
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="block px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/applications"
                  className="block px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Talent Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
