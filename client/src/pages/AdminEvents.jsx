import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/events");

      setEvents(response.data.events || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId, eventTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventTitle}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/events/${eventId}`);

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to delete this event."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">

          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              Administration
            </p>

            <h1 className="text-4xl font-bold text-slate-900 mt-2">
              Event Management
            </h1>

            <p className="text-slate-500 mt-3">
              Create, update and manage all your events.
            </p>
          </div>

          <Link
            to="/admin/events/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus size={19} />
            Add Event
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && events.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <CalendarDays size={30} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-6">
              No events yet
            </h2>

            <p className="text-slate-500 mt-2">
              Create your first event to get started.
            </p>

            <Link
              to="/admin/events/new"
              className="inline-flex items-center gap-2 mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
            >
              <Plus size={18} />
              Create Event
            </Link>
          </div>
        )}

        {/* Event list */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >

              {/* Image */}
              <div className="relative h-52">
                <img
                  src={
                    event.image ||
                    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
                  }
                  alt={event.title}
                  className="w-full h-full object-cover"
                />

                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">

                <h2 className="text-xl font-bold text-slate-900">
                  {event.title}
                </h2>

                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <CalendarDays
                      size={17}
                      className="text-indigo-600 shrink-0"
                    />

                    <span>
                      {new Date(event.date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Clock3
                      size={17}
                      className="text-indigo-600 shrink-0"
                    />

                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <MapPin
                      size={17}
                      className="text-indigo-600 shrink-0"
                    />

                    <span>
                      {event.venue}, {event.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Ticket
                      size={17}
                      className="text-indigo-600 shrink-0"
                    />

                    <span>
                      {event.availableSeats} / {event.totalSeats} seats
                      available
                    </span>
                  </div>

                </div>

                {/* Price */}
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      Ticket price
                    </p>

                    <p className="text-xl font-bold text-slate-900">
                      ₹{event.ticketPrice}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    {event.totalSeats} total seats
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                  <Link
                    to={`/admin/events/edit/${event._id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(event._id, event.title)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default AdminEvents;