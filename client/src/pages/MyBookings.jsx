import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my-bookings");

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);

      await api.put(`/bookings/${bookingId}/cancel`);

      await fetchBookings();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
            Your activity
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            My Bookings
          </h1>

          <p className="text-slate-500 mt-3">
            View and manage all your Eventora bookings.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-red-600 mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && bookings.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Ticket size={30} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-6">
              No bookings yet
            </h2>

            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              You haven't booked any events yet. Explore Eventora
              and find something exciting.
            </p>

            <Link
              to="/events"
              className="inline-flex items-center justify-center mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
            >
              Explore Events
            </Link>
          </div>
        )}

        {/* Bookings */}
        <div className="space-y-6">
          {bookings.map((booking) => {
            const event = booking.event;

            const eventDate = event?.date
              ? new Date(event.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date unavailable";

            return (
              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="grid md:grid-cols-[260px_1fr]">

                  {/* Event image */}
                  <div className="h-56 md:h-full">
                    <img
                      src={
                        event?.image ||
                        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
                      }
                      alt={event?.title || "Event"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-8">

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            booking.bookingStatus === "confirmed"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {booking.bookingStatus === "confirmed"
                            ? "Confirmed"
                            : "Cancelled"}
                        </span>

                        <h2 className="text-2xl font-bold text-slate-900 mt-3">
                          {event?.title || "Event"}
                        </h2>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          Booking Reference
                        </p>

                        <p className="font-bold text-indigo-600 mt-1">
                          {booking.bookingReference}
                        </p>
                      </div>
                    </div>

                    {/* Event information */}
                    <div className="grid sm:grid-cols-2 gap-4 mt-6">

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <CalendarDays
                            size={18}
                            className="text-indigo-600"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Date
                          </p>

                          <p className="font-medium text-slate-700">
                            {eventDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <Clock3
                            size={18}
                            className="text-indigo-600"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Time
                          </p>

                          <p className="font-medium text-slate-700">
                            {event?.time || "Time unavailable"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <MapPin
                            size={18}
                            className="text-indigo-600"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Location
                          </p>

                          <p className="font-medium text-slate-700">
                            {event?.venue}, {event?.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <Ticket
                            size={18}
                            className="text-indigo-600"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Tickets
                          </p>

                          <p className="font-medium text-slate-700">
                            {booking.numberOfTickets} ticket
                            {booking.numberOfTickets !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div>
                        <p className="text-sm text-slate-400">
                          Total amount
                        </p>

                        <p className="text-2xl font-bold text-slate-900">
                          ₹{booking.totalAmount}
                        </p>
                      </div>

                      {booking.bookingStatus === "confirmed" && (
                        <button
                          onClick={() =>
                            handleCancel(booking._id)
                          }
                          disabled={
                            cancellingId === booking._id
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                        >
                          <XCircle size={18} />

                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;