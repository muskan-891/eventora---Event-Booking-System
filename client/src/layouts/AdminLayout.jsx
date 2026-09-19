import { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ExternalLink,
  LogOut,
  Menu,
  Plus,
  Ticket,
  X,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("eventora_token");
    localStorage.removeItem("eventora_user");

    window.dispatchEvent(new Event("eventora-auth-change"));

    navigate("/");
  };

  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      name: "Events",
      path: "/admin/events",
      icon: CalendarDays,
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: Ticket,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: BarChart3,
    },
    {
      name: "Add Event",
      path: "/admin/events/new",
      icon: Plus,
    },
  ];

  

  const isActive = (path) => {
    if (path === "/admin/events") {
      return (
        location.pathname === "/admin/events" ||
        location.pathname.startsWith("/admin/events/edit/")
      );
    }

    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 h-16 bg-slate-950 text-white flex items-center justify-between px-5">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2"
        >
          <div className="h-9 w-9 rounded-lg bg-indigo-500 flex items-center justify-center">
            <CalendarDays size={18} />
          </div>

          <span className="font-bold">
            Eventora
          </span>
        </Link>

        <button
          onClick={() => setSidebarOpen(true)}
          className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"
        >
          <Menu size={21} />
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72
          bg-slate-950 text-white
          flex flex-col
          transform transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">

          <Link
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <CalendarDays size={21} />
            </div>

            <div>
              <p className="font-bold text-lg">
                Eventora
              </p>

              <p className="text-xs text-slate-400">
                Admin Panel
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-7">

          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Management
          </p>

          <nav className="space-y-1">

            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-3
                    text-sm font-medium transition
                    ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon size={19} />
                  {link.name}
                </Link>
              );
            })}

          </nav>

          <div className="mt-8">

            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Website
            </p>

            <Link
              to="/events"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <ExternalLink size={19} />
              View Website
            </Link>

          </div>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10">

          <div className="rounded-2xl bg-white/5 p-4 mb-3">
            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <Ticket size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  Admin Account
                </p>

                <p className="text-xs text-slate-500">
                  Administrator
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;