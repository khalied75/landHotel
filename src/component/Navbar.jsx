import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const userName =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "User";

  async function handleLogout() {
    try {
      await signOut(auth);
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          {/* Bed Icon SVG */}
          <svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="10" width="28" height="9" rx="2" stroke="#2563EB" strokeWidth="2" fill="none"/>
            <rect x="3" y="5" width="10" height="6" rx="1.5" stroke="#2563EB" strokeWidth="2" fill="none"/>
            <rect x="17" y="5" width="10" height="6" rx="1.5" stroke="#2563EB" strokeWidth="2" fill="none"/>
            <line x1="1" y1="19" x2="1" y2="22" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
            <line x1="29" y1="19" x2="29" y2="22" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-gray-900">Hotel of Land</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            {/* Home Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9L12 2l9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </NavLink>

          <NavLink
            to="/available"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            {/* Bed Icon small */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9V4a1 1 0 011-1h18a1 1 0 011 1v5"/>
              <path d="M2 9h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z"/>
              <path d="M6 9V6h5v3"/>
              <path d="M13 9V6h5v3"/>
            </svg>
            Available
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            {/* Mail Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
            Contact
          </NavLink>

          <NavLink
            to="/rate"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            {/* Star Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Rate Us
          </NavLink>

          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{userName}</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {/* Person Icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/available" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Available</NavLink>
          <NavLink to="/contact" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <NavLink to="/rate" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Rate Us</NavLink>
          {user ? (
            <>
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-center font-semibold text-blue-700">
                {userName}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="bg-blue-600 text-white text-center py-2 rounded-lg font-semibold" onClick={() => setMenuOpen(false)}>Login</NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
