import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  Ticket,
  XCircle,
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

const AdminReports = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/admin/all");

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Failed to load reports:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load report data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const report = useMemo(() => {
    const confirmed = bookings.filter(
      (booking) => booking.bookingStatus === "confirmed"
    );

    const cancelled = bookings.filter(
      (booking) => booking.bookingStatus === "cancelled"
    );

    const ticketsSold = confirmed.reduce(
      (total, booking) =>
        total + Number(booking.numberOfTickets || 0),
      0
    );

    const revenue = confirmed.reduce(
      (total, booking) =>
        total + Number(booking.totalAmount || 0),
      0
    );

    const eventMap = {};

    confirmed.forEach((booking) => {
      const eventId = booking.event?._id;

      if (!eventId) return;

      if (!eventMap[eventId]) {
        eventMap[eventId] = {
          name: booking.event?.title || "Unknown Event",
          bookings: 0,
          tickets: 0,
          revenue: 0,
        };
      }

      eventMap[eventId].bookings += 1;

      eventMap[eventId].tickets += Number(
        booking.numberOfTickets || 0
      );

      eventMap[eventId].revenue += Number(
        booking.totalAmount || 0
      );
    });

    const eventData = Object.values(eventMap);

    return {
      totalBookings: bookings.length,
      confirmedBookings: confirmed.length,
      cancelledBookings: cancelled.length,
      ticketsSold,
      revenue,
      eventData,
    };
  }, [bookings]);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Analytics
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-slate-500">
            Monitor bookings, ticket sales and event revenue.
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

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="text-sm text-slate-500">
              Preparing reports...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <ReportCard
              icon={<BarChart3 size={21} />}
              title="Total Bookings"
              value={report.totalBookings}
              description="All booking records"
            />

            <ReportCard
              icon={<CheckCircle2 size={21} />}
              title="Confirmed"
              value={report.confirmedBookings}
              description="Successful bookings"
            />

            <ReportCard
              icon={<XCircle size={21} />}
              title="Cancelled"
              value={report.cancelledBookings}
              description="Cancelled bookings"
            />

            <ReportCard
              icon={<Ticket size={21} />}
              title="Tickets Sold"
              value={report.ticketsSold}
              description="Confirmed tickets"
            />

            <ReportCard
              icon={<IndianRupee size={21} />}
              title="Revenue"
              value={formatCurrency(report.revenue)}
              description="Confirmed bookings"
            />
          </div>

          {/* Chart */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Event Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tickets sold and revenue generated by event.
              </p>
            </div>

            {report.eventData.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center text-center">
                <div>
                  <BarChart3
                    size={42}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <p className="font-medium text-slate-600">
                    No confirmed bookings yet
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Event performance will appear here after
                    successful bookings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={report.eventData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 40,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-20}
                      textAnchor="end"
                      interval={0}
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="tickets"
                      name="Tickets Sold"
                      radius={[6, 6, 0, 0]}
                    />

                    <Bar
                      dataKey="revenue"
                      name="Revenue"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Event Report Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Event-wise Report
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Detailed performance of confirmed bookings.
              </p>
            </div>

            {report.eventData.length === 0 ? (
              <div className="p-10 text-center">
                <CalendarDays
                  size={40}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="font-medium text-slate-600">
                  No event data available
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Event
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Bookings
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tickets
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {report.eventData.map((event, index) => (
                      <tr
                        key={`${event.name}-${index}`}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                              <CalendarDays size={17} />
                            </div>

                            <span className="font-semibold text-slate-800">
                              {event.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5 font-medium text-slate-700">
                          {event.bookings}
                        </td>

                        <td className="px-6 py-5 font-medium text-slate-700">
                          {event.tickets}
                        </td>

                        <td className="px-6 py-5 font-semibold text-slate-900">
                          {formatCurrency(event.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Report Note */}
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <div className="flex gap-3">
              <BarChart3
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <div>
                <p className="font-semibold text-indigo-900">
                  Report calculation
                </p>

                <p className="mt-1 text-sm leading-6 text-indigo-700">
                  Revenue and ticket sales are calculated only
                  from confirmed bookings. Cancelled bookings
                  remain visible in the booking count but are
                  excluded from revenue and ticket-sales totals.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ReportCard = ({
  icon,
  title,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
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

export default AdminReports;