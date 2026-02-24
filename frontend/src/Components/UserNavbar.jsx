import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Film } from "lucide-react";

const UserNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#f5c518] p-1.5 rounded-lg">
            <Film size={24} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            CINE<span className="text-[#f5c518]">BOOK</span>
          </span>
        </Link>
        {/* User Navigation */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-sm font-bold uppercase tracking-widest text-[#f5c518] hover:text-white transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/#movies-section"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#f5c518] transition-colors cursor-pointer"
          >
            Movies
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#f5c518] transition-colors cursor-pointer"
          >
            My Bookings
          </Link>
        </div>
        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="btn-fill-gold !py-1.5 !px-4 text-[10px] tracking-widest flex items-center gap-2"
              >
                <User size={14} /> ACCOUNT
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="btn-outline-gold !py-1.5 !px-4 text-[10px] tracking-widest"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="btn-fill-gold !py-1.5 !px-4 text-[10px] tracking-widest"
              >
                JOIN
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
