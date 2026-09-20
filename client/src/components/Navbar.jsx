import { useEffect, useState } from "react";
import {
  LogOut,
  Menu,
  Ticket,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EventoraLogo from "./EventoraLogo";

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

    window.dispatchEvent(new Event("eventora-auth-change"));

    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex h-20 items-center justify-between">

          {/* =========================
              LOGO
          ========================== */}
          <Link
            to="/"
            onClick={closeMenu}
            className="shrink-0 transition-opacity hover:opacity-85"
          >
            <EventoraLogo />
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}
          <div className="hidden md:flex items-center gap-8">

            {/* Home */}
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
            >
              Home
            </Link>

            {/* Events */}
            <Link
              to="/events"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
            >
              Events
            </Link>

            {/* My Bookings */}
            {user && (
              <Link
                to="/my-bookings"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                <Ticket size={16} strokeWidth={1.8} />
                My Bookings
              </Link>
            )}

            {/* =========================
                LOGGED OUT
            ========================== */}
            {!user ? (
              <div className="flex items-center gap-4">

                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 transition-colors hover:text-indigo-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
                >
                  Get Started
                </Link>

              </div>
            ) : (

              /* =========================
                  LOGGED IN
              ========================== */
              <div className="flex items-center gap-5">

                {/* User information */}
                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <User size={17} strokeWidth={1.8} />
                  </div>

                  <div className="leading-tight">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Welcome
                    </p>

                    <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>
                  </div>

                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={16} strokeWidth={1.8} />
                  Logout
                </button>

              </div>
            )}
          </div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================== */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
          >
            {menuOpen ? (
              <X size={20} strokeWidth={1.8} />
            ) : (
              <Menu size={20} strokeWidth={1.8} />
            )}
          </button>
        </div>

        {/* =========================
            MOBILE NAVIGATION
        ========================== */}
        {menuOpen && (
          <div className="border-t border-slate-100 py-5 md:hidden">

            <div className="flex flex-col gap-1">

              {/* Home */}
              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
              >
                Home
              </Link>

              {/* Events */}
              <Link
                to="/events"
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
              >
                Events
              </Link>

              {/* My Bookings */}
              {user && (
                <Link
                  to="/my-bookings"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
                >
                  <Ticket size={17} strokeWidth={1.8} />
                  My Bookings
                </Link>
              )}

              {/* =========================
                  MOBILE LOGGED OUT
              ========================== */}
              {!user ? (
                <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-4">

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    Get Started
                  </Link>

                </div>
              ) : (

                /* =========================
                    MOBILE LOGGED IN
                ========================== */
                <div className="mt-3 border-t border-slate-100 pt-5">

                  <div className="mb-4 flex items-center gap-3 px-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <User size={18} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Welcome
                      </p>

                      <p className="font-semibold text-slate-800">
                        {user.name}
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} strokeWidth={1.8} />
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