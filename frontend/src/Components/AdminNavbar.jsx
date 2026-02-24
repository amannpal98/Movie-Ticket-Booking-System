import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";

const AdminNavbar = () => {
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
        <Link to="/admin" className="flex items-center gap-2 group">
          <div className="bg-[#f5c518] p-1.5 rounded-lg">
            <LayoutDashboard size={24} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            ADMIN <span className="text-[#f5c518]">PANEL</span>
          </span>
        </Link>
        {/* Admin Navigation */}
        <div className="flex items-center gap-10">
          <Link
            to="/admin"
            className="text-sm font-bold uppercase tracking-widest text-[#f5c518] hover:text-white transition-colors cursor-pointer"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/movies"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#f5c518] transition-colors cursor-pointer"
          >
            Movies
          </Link>
          <Link
            to="/admin/cinemas"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#f5c518] transition-colors cursor-pointer"
          >
            Cinemas
          </Link>
          <Link
            to="/admin/shows"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#f5c518] transition-colors cursor-pointer"
          >
            Shows
          </Link>
          <Link
            to="/admin/bookings"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#f5c518] transition-colors cursor-pointer"
          >
            Bookings
          </Link>
          <Link
            to="/admin/categories"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#f5c518] transition-colors cursor-pointer"
          >
            Categories
          </Link>
        </div>
        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
