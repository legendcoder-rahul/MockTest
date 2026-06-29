import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Subjects", path: "/subjects" },
    { name: "PYQ Bank", path: "/pyq-bank" },
    { name: "AI Tutor", path: "/ai-tutor" },
    { name: "Profile", path: "/profile" }
  ];

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-surface-container-lowest text-primary sticky top-0 border-b border-outline-variant z-50">
      <div className="flex justify-between items-center w-full px-6 md:px-8 max-w-[1280px] mx-auto h-16">
        {/* Brand Logo & Search */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-[24px] font-bold tracking-tight text-primary font-[Poppins]">
            ExamAI
          </Link>
          {/* Search bar */}
          <div className="hidden md:flex relative items-center w-64">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-high rounded-full border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant"
              placeholder="Search tests, topics..."
              type="text"
            />
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[14px] font-semibold tracking-[0.05em] transition-all duration-200 py-1 border-b-2 ${
                  isActive
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Trailing Actions & Profile */}
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-colors relative">
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
          </button>
          
          <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6HqaY1NcBTLlNIqELM8m_QN42txnD8VkGJ8_-wg2NWEPRl2gfwhy2nL0T_RjihLVU8r1vDj0Xp68FCXa3h-76a_TOdspXlbgopoh4iVL4x-G1-_EnGlUOUp-L5RCqT9Ey-Ei1FRD0cJ470FMJ3z2VQFYwSAjcSyCZJ-eHyVXB5TBaxsdylJRowvxSokxvS3tVtZeTiXdC5SLLnJ9alun2Y22kvMlXbJmrgP9jz7IPZi1q6jmsiUwEkg"
            />
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface-container-lowest px-6 py-4 flex flex-col gap-3 shadow-inner">
          <div className="relative items-center w-full flex mb-2">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">search</span>
            <input
              className="w-full pl-9 pr-4 py-2 bg-surface-container-high rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              placeholder="Search tests, topics..."
              type="text"
            />
          </div>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary-fixed text-primary font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
export default Header;
