import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Ticket,
  Users,
  IndianRupee,
  CheckCircle2,
  XCircle,
  CalendarDays,
  MapPin,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/admin/all");

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const stats = useMemo(() => {
    const confirmed = bookings.filter(
      (booking) => booking.bookingStatus === "confirmed"
    );

    const cancelled = bookings.filter(
      (booking) => booking.bookingStatus === "cancelled"
    );

    const tickets = confirmed.reduce(
      (sum, booking) => sum + booking.numberOfTickets,
      0
    );

    const revenue = confirmed.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    return {
      total: bookings.length,
      confirmed: confirmed.length,
      cancelled: cancelled.length,
      tickets,
      revenue,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return bookings;

    return bookings.filter((booking) => {
      const customerName = booking.user?.name || "";
      const customerEmail = booking.user?.email || "";
      const eventTitle = booking.event?.title || "";
      const reference = booking.bookingReference || "";
      const status = booking.bookingStatus || "";

      return (
        customerName.toLowerCase().includes(query) ||
        customerEmail.toLowerCase().includes(query) ||
        eventTitle.toLowerCase().includes(query) ||
        reference.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query)
      );
    });
  }, [bookings, search]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Management
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Bookings
          </h1>

          <p className="mt-1 text-slate-500">
            Manage and monitor all event bookings.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Ticket size={21} />}
          title="Total Bookings"
          value={stats.total}
          description="All bookings"
        />

        <StatCard
          icon={<CheckCircle2 size={21} />}
          title="Confirmed"
          value={stats.confirmed}
          description={`${stats.tickets} tickets sold`}
        />

        <StatCard
          icon={<XCircle size={21} />}
          title="Cancelled"
          value={stats.cancelled}
          description="Cancelled bookings"
        />

        <StatCard
          icon={<IndianRupee size={21} />}
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          description="Confirmed bookings"
        />
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by customer, email, event or booking reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="text-sm text-slate-500">
              Loading bookings...
            </p>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <Ticket
            size={42}
            className="mx-auto mb-4 text-slate-300"
          />

          <h2 className="text-lg font-semibold text-slate-800">
            No bookings found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {search
              ? "Try changing your search."
              : "There are no bookings yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Event
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Booking
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tickets
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                          {booking.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {booking.user?.name || "Unknown User"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {booking.user?.email || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">
                        {booking.event?.title || "Event unavailable"}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays size={13} />

                        {formatDate(booking.event?.date)}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={13} />

                        {booking.event?.venue || "—"},{" "}
                        {booking.event?.city || ""}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-mono text-xs font-semibold text-slate-700">
                        {booking.bookingReference}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(booking.createdAt)}
                      </p>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-700">
                      {booking.numberOfTickets}
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-800">
                      ₹{booking.totalAmount?.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        status={booking.bookingStatus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/tablet cards */}
          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {booking.user?.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {booking.user?.email || "—"}
                    </p>
                  </div>

                  <StatusBadge
                    status={booking.bookingStatus}
                  />
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">
                    {booking.event?.title || "Event unavailable"}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-500">
                    <div>
                      <p className="mb-1 text-slate-400">
                        Date
                      </p>

                      <p className="font-medium text-slate-700">
                        {formatDate(booking.event?.date)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-slate-400">
                        Tickets
                      </p>

                      <p className="font-medium text-slate-700">
                        {booking.numberOfTickets}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-slate-400">
                        Amount
                      </p>

                      <p className="font-medium text-slate-700">
                        ₹
                        {booking.totalAmount?.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-slate-400">
                        Booking Date
                      </p>

                      <p className="font-medium text-slate-700">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 font-mono text-xs text-slate-400">
                  {booking.bookingReference}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <Users size={14} />
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      </div>

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const confirmed = status === "confirmed";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        confirmed
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {confirmed ? (
        <CheckCircle2 size={13} />
      ) : (
        <XCircle size={13} />
      )}

      {confirmed ? "Confirmed" : "Cancelled"}
    </span>
  );
};

export default AdminBookings;