import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsSidebarCollapsed, useToggleSidebar } from "../../../core/stores/uiStore";
import { useAuthStore } from "../../../features/auth/stores/authStore";
import PermissionGuard from "../guards/PermissionGuard";
import { ChevronDownIcon } from "lucide-react";

export const Sidebar = () => {
  const isCollapsed = useIsSidebarCollapsed();
  const toggleSidebar = useToggleSidebar();
  const location = useLocation();

  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
  };

  const getMe = useAuthStore((state) => state.getMe);
  const handleGetMe = () => {
    getMe();
  };

  const linkClasses = (path, location) =>
    `block px-3 py-2 rounded transition-colors ${location.pathname === path ? "bg-gray-700" : "hover:bg-gray-700"
    }`;

  return (
    <aside
      className={`
        flex h-screen flex-col bg-gray-800 p-4 text-white transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      <div className="mb-10 flex items-center justify-between">
        {!isCollapsed && <p className="text-2xl font-bold">Enterprise</p>}
        <button
          onClick={toggleSidebar}
          className="rounded p-1 hover:bg-gray-700 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation items can be added here */}
      {!isCollapsed && (
        <div className="overflow-y-auto">
          <nav className="space-y-2">
            <Link to="/" className={linkClasses("/", location)}>
              Dashboard
            </Link>

            <div className="pt-4 pb-2">
              <p className="text-xs text-gray-400 px-3 mb-2">DEMOS</p>
            </div>

            <Link to="/ui-demo" className={linkClasses("ui-demo", location)}>
              UI System
            </Link>

            <Link to="/rbac-demo" className={linkClasses("/rbac-demo", location)}>
              RBAC System
            </Link>

            <Link to="/token-demo" className={linkClasses("/token-demo", location)}>
              Token Refresh
            </Link>

            <Link to="/session-demo" className={linkClasses("/session-demo", location)}>
              Session Expiry
            </Link>

            <Link to="/api-demo" className={linkClasses("/api-demo", location)}>
              API Client
            </Link>

            <Link to="/react-query-demo" className={linkClasses("/react-query-demo", location)}>
              React Query
            </Link>

            <PermissionGuard role="super_admin">
              <details className="group">
                <summary className="flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-700 cursor-pointer">
                  <span>User Management System</span>
                  <ChevronDownIcon className="transition group-open:-rotate-180" />
                </summary>

                <nav className="mt-2 space-y-1 pl-6">
                  <Link to="/users" className={linkClasses("/users", location)}>
                    User Statistics
                  </Link>
                  <Link to="/roles" className={linkClasses("/roles", location)}>
                    Create User
                  </Link>
                  <button
                    className={`${linkClasses(
                      "/roles",
                      location
                    )} w-full text-white bg-red-500 hover:bg-red-500`}
                    disabled={true}
                  >
                    Disabled
                  </button>
                  <button
                    className={`${linkClasses(
                      "/roles",
                      location
                    )} w-full text-white bg-red-500 hover:bg-red-500`}
                    disabled={true}
                  >
                    Disabled
                  </button>
                </nav>
              </details>
            </PermissionGuard>

            <button
              type="button"
              onClick={handleLogout}
              className="block px-3 py-2 rounded transition-colors  hover:bg-red-700 bg-red-600 text-white w-full text-left"
            >
              Logout
            </button>

            <button
              type="button"
              onClick={handleGetMe}
              className="block px-3 py-2 rounded transition-colors hover:bg-blue-700 bg-blue-600 text-white w-full text-left"
            >
              Get Me
            </button>
          </nav>
        </div>
      )}
    </aside>
  );
};
