import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, MapPin, Minus, Plus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const BookEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event);
      } catch (error) {
        console.error(error);
        setError("Unable to load event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const increaseTickets = () => {
    if (event && tickets < event.availableSeats) {
      setTickets((current) => current + 1);
    }
  };

  const decreaseTickets = () => {
    if (tickets > 1) {
      setTickets((current) => current - 1);
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("eventora_token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/events/${id}/book`,
        },
      });

      return;
    }

    try {
      setBooking(true);
      setError("");

      const response = await api.post("/bookings", {
        eventId: id,
        numberOfTickets: tickets,
      });

      navigate(`/booking-success/${response.data.booking._id}`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to complete booking. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-5xl animate-pulse rounded-3xl bg-slate-200 p-8">
          <div className="h-8 w-1/3 rounded bg-slate-300" />
          <div className="mt-6 h-48 rounded-2xl bg-slate-300" />
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Event unavailable
          </h1>

          <p className="mt-2 text-slate-500">{error}</p>

          <Link
            to="/events"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = event.ticketPrice * tickets;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          to={`/events/${event._id}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          ← Back to Event
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* Event summary */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

            <img
              src={event.image}
              alt={event.title}
              className="h-72 w-full object-cover"
            />

            <div className="p-7">

              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                {event.category}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                {event.title}
              </h1>

              <div className="mt-6 space-y-4">

                <div className="flex gap-3">
                  <CalendarDays
                    className="mt-0.5 text-indigo-600"
                    size={20}
                  />

                  <div>
                    <p className="font-medium text-slate-900">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <p className="text-sm text-slate-500">
                      {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin
                    className="mt-0.5 text-indigo-600"
                    size={20}
                  />

                  <div>
                    <p className="font-medium text-slate-900">
                      {event.venue}
                    </p>

                    <p className="text-sm text-slate-500">
                      {event.city}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              Book your tickets
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose how many tickets you'd like.
            </p>

            {/* Ticket selector */}
            <div className="mt-8 rounded-2xl bg-slate-50 p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="font-semibold text-slate-900">
                    Tickets
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    ₹{event.ticketPrice} per ticket
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <button
                    onClick={decreaseTickets}
                    disabled={tickets <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="w-8 text-center text-lg font-bold text-slate-900">
                    {tickets}
                  </span>

                  <button
                    onClick={increaseTickets}
                    disabled={tickets >= event.availableSeats}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={17} />
                  </button>

                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-3">

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  ₹{event.ticketPrice} × {tickets}
                </span>

                <span className="font-medium text-slate-900">
                  ₹{totalAmount}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">

                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{totalAmount}
                  </span>
                </div>

              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={booking || event.availableSeats === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {booking ? (
                "Confirming booking..."
              ) : (
                <>
                  <CheckCircle2 size={19} />
                  Confirm Booking
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              {event.availableSeats} seats currently available
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEvent;