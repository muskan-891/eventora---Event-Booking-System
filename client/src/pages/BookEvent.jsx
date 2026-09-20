import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  LockKeyhole,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80";

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

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">

          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">

            <div className="overflow-hidden rounded-3xl bg-white">
              <div className="h-80 animate-pulse bg-slate-200" />

              <div className="space-y-5 p-8">
                <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              </div>
            </div>

            <div className="h-[500px] animate-pulse rounded-3xl bg-slate-200" />

          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error && !event) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Ticket size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Event unavailable
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            {error}
          </p>

          <Link
            to="/events"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>

        </div>
      </div>
    );
  }

  const totalAmount = event.ticketPrice * tickets;
  const isSoldOut = event.availableSeats === 0;

  const isLowSeats =
    event.availableSeats > 0 &&
    event.availableSeats <= Math.max(10, Math.floor(event.totalSeats * 0.15));

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-7 lg:px-8">

          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to event
          </Link>

          <div className="mt-6">

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Secure booking
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Book your tickets
            </h1>

            <p className="mt-2 text-slate-500">
              Choose your tickets and confirm your experience.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

          {/* =================================================
              EVENT SUMMARY
          ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Image */}

            <div className="relative h-72 overflow-hidden sm:h-80">

              <img
                src={event.image || fallbackImage}
                alt={event.title}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5">

                <span className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
                  {event.category}
                </span>

              </div>

            </div>

            <div className="p-7 sm:p-8">

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {event.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                You're just a few steps away from experiencing this event.
              </p>

              {/* Event details */}

              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <CalendarDays size={19} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {formattedDate}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Clock size={19} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Time
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {event.time}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <MapPin size={19} />
                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Venue
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {event.venue}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {event.city}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* Availability */}

              <div
                className={`mt-6 flex items-center gap-3 rounded-2xl p-4 ${
                  isLowSeats
                    ? "bg-orange-50 text-orange-700"
                    : isSoldOut
                    ? "bg-red-50 text-red-700"
                    : "bg-indigo-50 text-indigo-700"
                }`}
              >

                <Users size={19} />

                <div>

                  <p className="text-sm font-semibold">
                    {isSoldOut
                      ? "This event is sold out"
                      : `${event.availableSeats} seats currently available`}
                  </p>

                  {!isSoldOut && isLowSeats && (
                    <p className="mt-0.5 text-xs">
                      Tickets are filling up quickly.
                    </p>
                  )}

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              BOOKING CARD
          ================================================= */}

          <aside>

            <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

              {/* Card header */}

              <div className="bg-slate-950 px-7 py-6 text-white">

                <p className="text-sm text-slate-400">
                  Your booking
                </p>

                <div className="mt-2 flex items-end justify-between">

                  <div>

                    <p className="text-3xl font-bold">
                      ₹{event.ticketPrice}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      per ticket
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
                    <Ticket size={21} />
                  </div>

                </div>

              </div>

              <div className="p-7">

                {/* Ticket selector */}

                <div>

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-bold text-slate-900">
                        Number of tickets
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Select how many you'd like
                      </p>

                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      Max {event.availableSeats}
                    </span>

                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">

                    <button
                      onClick={decreaseTickets}
                      disabled={tickets <= 1}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={18} />
                    </button>

                    <div className="text-center">

                      <p className="text-2xl font-bold text-slate-900">
                        {tickets}
                      </p>

                      <p className="text-xs text-slate-400">
                        {tickets === 1 ? "ticket" : "tickets"}
                      </p>

                    </div>

                    <button
                      onClick={increaseTickets}
                      disabled={tickets >= event.availableSeats}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={18} />
                    </button>

                  </div>

                </div>

                {/* Price summary */}

                <div className="my-7 border-t border-slate-200" />

                <div className="space-y-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Ticket price
                    </span>

                    <span className="font-medium text-slate-900">
                      ₹{event.ticketPrice}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Quantity
                    </span>

                    <span className="font-medium text-slate-900">
                      × {tickets}
                    </span>

                  </div>

                  <div className="border-t border-slate-200 pt-4">

                    <div className="flex items-end justify-between">

                      <span className="font-bold text-slate-900">
                        Total
                      </span>

                      <span className="text-3xl font-bold text-indigo-600">
                        ₹{totalAmount}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Error */}

                {error && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                    {error}
                  </div>
                )}

                {/* Confirm */}

                <button
                  onClick={handleBooking}
                  disabled={
                    booking ||
                    event.availableSeats === 0 ||
                    tickets > event.availableSeats
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {booking ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Confirming booking...
                    </>
                  ) : isSoldOut ? (
                    "Sold Out"
                  ) : (
                    <>
                      <CheckCircle2 size={19} />
                      Confirm Booking
                    </>
                  )}
                </button>

                {/* Security */}

                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3 text-xs text-slate-500">

                    <LockKeyhole
                      size={16}
                      className="text-indigo-600"
                    />

                    <span>
                      Secure booking through Eventora
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">

                    <ShieldCheck
                      size={16}
                      className="text-indigo-600"
                    />

                    <span>
                      Your booking details are safely stored
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

      {/* =====================================================
          BOTTOM TRUST SECTION
      ===================================================== */}

      <section className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

          <div className="grid gap-6 sm:grid-cols-3">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <div>

                <p className="font-semibold text-slate-900">
                  Instant confirmation
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your booking confirmation is generated immediately.
                </p>

              </div>

            </div>

            <div className="flex items-start gap-3">

              <Ticket
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <div>

                <p className="font-semibold text-slate-900">
                  Digital ticket
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  View your ticket anytime from your booking history.
                </p>

              </div>

            </div>

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <div>

                <p className="font-semibold text-slate-900">
                  Secure experience
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your booking information is securely handled.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default BookEvent;