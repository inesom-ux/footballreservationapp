import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png"; // your logo

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear token & user
    setProfileOpen(false);
    navigate("/"); // redirect to home
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="GoalTime" className="w-50 h-10 rounded-full" />
        </div>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="/" className="hover:text-green-600">Home</a>
          <a href="/stadiums" className="hover:text-green-600">Stadiums</a>
          <a href="/reservations" className="hover:text-green-600">Reservations</a>
          <a href="/about" className="hover:text-green-600">About Us</a>
          <a href="/contact" className="hover:text-green-600">Contact</a>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="rounded-full bg-green-600 text-white w-9 h-9 flex items-center justify-center hover:bg-green-700 transition-all"
          >
            <User size={20} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg z-50 animate-fade-in">
              {!user ? (
                // 👤 Not logged in
                <a
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50 text-center"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign In
                </a>
              ) : (
                // ✅ Logged in
                <>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-white px-6 pb-4 space-y-2 border-t">
          <a href="/" className="hover:text-green-600">Home</a>
          <a href="/stadiums" className="hover:text-green-600">Stadiums</a>
          <a href="/reservations" className="hover:text-green-600">Reservations</a>
          <a href="/about" className="hover:text-green-600">About Us</a>
          <a href="/contact" className="hover:text-green-600">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
