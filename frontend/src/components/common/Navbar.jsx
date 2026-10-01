import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Menu, X, User as UserIcon, Shield, LogOut, Compass, Sparkles, Navigation, Calendar, BookOpen } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-xs uppercase tracking-wider font-semibold transition-all px-3 py-2 rounded-lg ${
      isActive
        ? 'text-sky-400 bg-sky-500/10 shadow-sm shadow-sky-500/10'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 text-sm font-semibold uppercase tracking-wider py-3 px-4 rounded-xl transition-all ${
      isActive ? 'text-sky-400 bg-sky-500/15' : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-sky-400 transition-colors uppercase">
                CAR RENTAL & MOBILITY
              </span>
              <span className="text-[10px] tracking-widest text-sky-400/80 font-medium -mt-1">
                MOVE FREELY • TRAVEL SMARTER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {isAdmin ? (
              // Admin Navigation
              <>
                <NavLink to="/admin" end className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/cars" className={linkClass}>
                  Cars
                </NavLink>
                <NavLink to="/admin/bookings" className={linkClass}>
                  Bookings
                </NavLink>
                <NavLink to="/admin/customers" className={linkClass}>
                  Customers
                </NavLink>
                <NavLink to="/tracking" className={linkClass}>
                  Tracking
                </NavLink>
                <NavLink to="/admin/payments" className={linkClass}>
                  Payments
                </NavLink>
              </>
            ) : isAuthenticated ? (
              // Customer Authenticated Navigation
              <>
                <NavLink to="/" end className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/cars" className={linkClass}>
                  Cars
                </NavLink>
                <NavLink to="/bookings" className={linkClass}>
                  Bookings
                </NavLink>
                <NavLink to="/tracking" className={linkClass}>
                  Tracking
                </NavLink>
                <NavLink to="/recommendations" className={linkClass}>
                  Recommendations
                </NavLink>
                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>
              </>
            ) : (
              // Public / Guest Navigation
              <>
                <NavLink to="/" end className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/cars" className={linkClass}>
                  Cars
                </NavLink>
                <NavLink to="/bookings" className={linkClass}>
                  Bookings
                </NavLink>
                <NavLink to="/tracking" className={linkClass}>
                  Tracking
                </NavLink>
                <NavLink to="/recommendations" className={linkClass}>
                  Recommendations
                </NavLink>
                <NavLink to="/about" className={linkClass}>
                  About
                </NavLink>
              </>
            )}
          </div>

          {/* User Status / CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/api-docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold uppercase tracking-wider transition-colors"
              title="Interactive Swagger OpenAPI Documentation"
            >
              <BookOpen className="w-3.5 h-3.5" />
              API Docs
            </a>
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover border border-sky-500/40"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight">{user?.name}</span>
                    <span className="text-[10px] text-sky-400 font-mono tracking-wider">{user?.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs uppercase tracking-wider font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg shadow-md shadow-sky-500/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-dropdown border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {isAdmin ? (
            <>
              <NavLink to="/admin" end onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                <Shield className="w-4 h-4 text-sky-400" /> Dashboard
              </NavLink>
              <NavLink to="/admin/cars" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                <Car className="w-4 h-4 text-sky-400" /> Cars
              </NavLink>
              <NavLink to="/admin/bookings" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                <Calendar className="w-4 h-4 text-sky-400" /> Bookings
              </NavLink>
              <NavLink to="/admin/customers" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                <UserIcon className="w-4 h-4 text-sky-400" /> Customers
              </NavLink>
              <NavLink to="/tracking" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                <Navigation className="w-4 h-4 text-sky-400" /> Tracking
              </NavLink>
              <NavLink to="/admin/payments" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                <Compass className="w-4 h-4 text-sky-400" /> Payments
              </NavLink>
            </>
          ) : isAuthenticated ? (
            <>
              <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Home
              </NavLink>
              <NavLink to="/cars" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Cars
              </NavLink>
              <NavLink to="/bookings" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Bookings
              </NavLink>
              <NavLink to="/tracking" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Tracking
              </NavLink>
              <NavLink to="/recommendations" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Recommendations
              </NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Home
              </NavLink>
              <NavLink to="/cars" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Cars
              </NavLink>
              <NavLink to="/bookings" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Bookings
              </NavLink>
              <NavLink to="/tracking" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Tracking
              </NavLink>
              <NavLink to="/recommendations" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Recommendations
              </NavLink>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                About
              </NavLink>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                Login
              </NavLink>
            </>
          )}

          <a
            href="/api-docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider py-3 px-4 rounded-xl text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition-all"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            Swagger API Docs
          </a>

          {isAuthenticated && (
            <div className="pt-4 mt-2 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
