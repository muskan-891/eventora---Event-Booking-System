import { useEffect, useState } from "react";
import {
  CalendarDays,
  Ticket,
  Users,
  IndianRupee,
  BarChart3,
  Clock3,
  MapPin,
  RefreshCw,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../services/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");

      console.log("Dashboard API response:", response.data);

      // Supports different possible backend response structures
      const dashboardData =
        response.data.dashboard ||
        response.data.data ||
        response.data;

      setDashboard(dashboardData);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-3xl bg-white border border-red-100 shadow-sm p-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <BarChart3 size={26} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-5">
            Dashboard unavailable
          </h2>

          <p className="text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalEvents = dashboard?.totalEvents ?? 0;
  const totalUsers = dashboard?.totalUsers ?? 0;
  const totalBookings = dashboard?.totalBookings ?? 0;
  const totalTicketsSold = dashboard?.totalTicketsSold ?? 0;
  const totalRevenue = dashboard?.totalRevenue ?? 0;

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      icon: CalendarDays,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Confirmed Bookings",
      value: totalBookings,
      icon: Ticket,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Tickets Sold",
      value: totalTicketsSold,
      icon: Ticket,
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(totalRevenue).toLocaleString(
        "en-IN"
      )}`,
      icon: IndianRupee,
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
  ];

  const chartData = dashboard?.bookingStats || [];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              Administration
            </p>

            <h1 className="text-4xl font-bold text-slate-900 mt-2">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-3">
              Monitor your events, bookings and platform activity.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div
                  className={`h-11 w-11 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center`}
                >
                  <Icon size={21} />
                </div>

                <p className="text-sm text-slate-500 mt-5">
                  {stat.title}
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Booking Overview
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Confirmed bookings by event
                </p>
              </div>

              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
            </div>

            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="eventTitle"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="totalBookings"
                      fill="#4f46e5"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
                  <BarChart3 size={25} />
                </div>

                <p className="font-semibold text-slate-700 mt-4">
                  No booking data yet
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Booking statistics will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Quick summary */}
          <div className="bg-slate-950 rounded-3xl p-7 text-white">
            <p className="text-sm text-slate-400">
              Platform Overview
            </p>

            <h2 className="text-2xl font-bold mt-2">
              Eventora
            </h2>

            <div className="mt-8 space-y-6">

              <div>
                <p className="text-sm text-slate-400">
                  Events hosted
                </p>

                <p className="text-3xl font-bold mt-1">
                  {totalEvents}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Registered users
                </p>

                <p className="text-3xl font-bold mt-1">
                  {totalUsers}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Revenue generated
                </p>

                <p className="text-3xl font-bold mt-1">
                  ₹
                  {Number(totalRevenue).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Upcoming Events
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Events currently scheduled on Eventora.
            </p>
          </div>

          {dashboard?.upcomingEvents?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {dashboard.upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="rounded-2xl border border-slate-100 overflow-hidden"
                >
                  <div className="h-40">
                    <img
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">

                    <h3 className="font-bold text-slate-900 text-lg">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-3">

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays
                          size={16}
                          className="text-indigo-600"
                        />

                        {new Date(
                          event.date
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock3
                          size={16}
                          className="text-indigo-600"
                        />

                        {event.time}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin
                          size={16}
                          className="text-indigo-600"
                        />

                        {event.venue}, {event.city}
                      </div>

                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between">
                      <span className="text-sm text-slate-500">
                        Available seats
                      </span>

                      <span className="font-bold text-slate-900">
                        {event.availableSeats}
                      </span>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="py-12 text-center">
              <CalendarDays
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="text-slate-500 mt-3">
                No upcoming events.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;