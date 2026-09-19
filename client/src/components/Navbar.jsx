import { useEffect, useState } from "react";
import {
  CalendarDays,
  LogOut,
  Menu,
  Ticket,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const checkLogin = () => {
    const token = localStorage.getItem("eventora_token");
    const storedUser = localStorage.getItem("eventora_user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkLogin();

    window.addEventListener("eventora-auth-change", checkLogin);

    return () => {
      window.removeEventListener("eventora-auth-change", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eventora_token");
    localStorage.removeItem("eventora_user");

    setUser(null);
    setMenuOpen(false);

    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <CalendarDays size={21} />
            </div>

            <span className="text-xl font-bold text-slate-900">
              Eventora
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">

            <Link
              to="/"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              Home
            </Link>

            <Link
              to="/events"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              Events
            </Link>

            {user && (
              <Link
                to="/my-bookings"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                <Ticket size={17} />
                My Bookings
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">

                {/* User */}
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <User size={17} />
                  </div>

                  <div className="leading-tight">
                    <p className="text-xs text-slate-400">
                      Welcome
                    </p>

                    <p className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-5">

            <div className="flex flex-col gap-4">

              <Link
                to="/"
                onClick={closeMenu}
                className="text-sm font-medium text-slate-700"
              >
                Home
              </Link>

              <Link
                to="/events"
                onClick={closeMenu}
                className="text-sm font-medium text-slate-700"
              >
                Events
              </Link>

              {user && (
                <Link
                  to="/my-bookings"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <Ticket size={17} />
                  My Bookings
                </Link>
              )}

              {!user ? (
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100">

                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <User size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Welcome
                      </p>

                      <p className="font-semibold text-slate-800">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;