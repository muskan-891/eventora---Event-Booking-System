import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import api from "../services/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80";

const EventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event);
      } catch (error) {
        console.error(error);
        setError("Unable to load this event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  /* =========================================================
     LOADING
  ========================================================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-56 animate-pulse rounded-2xl bg-slate-200" />
            </div>

            <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */
  if (error || !event) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Ticket size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Event not found
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            We couldn't find the event you're looking for. It may have been
            removed or the link may no longer be available.
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

  const isSoldOut = event.availableSeats <= 0;

  const isLowSeats =
    event.availableSeats > 0 &&
    event.availableSeats <= Math.max(10, Math.floor(event.totalSeats * 0.15));

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const shortDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-slate-950">

        <div className="relative h-[480px] sm:h-[540px]">

          <img
            src={event.image || fallbackImage}
            alt={event.title}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            className="h-full w-full object-cover"
          />

          {/* Dark overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

          {/* Hero content */}
          <div className="absolute inset-x-0 bottom-0">

            <div className="mx-auto max-w-7xl px-6 pb-10 lg:px-8 lg:pb-14">

              <Link
                to="/events"
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <ArrowLeft size={16} />
                Back to Events
              </Link>

              <div className="flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                  <Sparkles size={15} />
                  {event.category}
                </span>

                {isSoldOut ? (
                  <span className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                    Sold Out
                  </span>
                ) : isLowSeats ? (
                  <span className="rounded-full bg-orange-500/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                    Filling Fast
                  </span>
                ) : (
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                    {event.availableSeats} seats available
                  </span>
                )}

              </div>

              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                {event.description}
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">

        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}
          <div>

            {/* Event information */}
            <div className="grid gap-4 sm:grid-cols-3">

              {/* Date */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CalendarDays size={21} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Date
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {shortDate}
                </p>

              </div>

              {/* Time */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Clock size={21} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Time
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {event.time}
                </p>

              </div>

              {/* Location */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin size={21} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Location
                </p>

                <p className="mt-1 line-clamp-1 font-semibold text-slate-900">
                  {event.city}
                </p>

              </div>

            </div>

            {/* =================================================
                ABOUT
            ================================================= */}
            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Experience
                  </p>

                  <h2 className="text-2xl font-bold text-slate-900">
                    About this event
                  </h2>
                </div>

              </div>

              <p className="mt-6 leading-8 text-slate-600">
                {event.description}
              </p>

            </section>

            {/* =================================================
                EVENT HIGHLIGHTS
            ================================================= */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

              <h2 className="text-xl font-bold text-slate-900">
                Event highlights
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Confirmed booking
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Your booking confirmation will be generated instantly.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Digital ticket
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Access your booking details from your account.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Flexible ticket quantity
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Select the number of tickets you need during booking.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Secure booking
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Your booking is securely stored in Eventora.
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                VENUE
            ================================================= */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Where it's happening
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Venue
              </h2>

              <div className="mt-6 flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin size={22} />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {event.venue}
                  </p>

                  <p className="mt-1 text-slate-500">
                    {event.city}
                  </p>

                  <p className="mt-3 text-sm text-slate-400">
                    {formattedDate} · {event.time}
                  </p>
                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              BOOKING CARD
          ================================================= */}
          <aside>

            <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

              {/* Card top */}
              <div className="bg-slate-950 p-7 text-white">

                <p className="text-sm font-medium text-slate-400">
                  Tickets starting from
                </p>

                <div className="mt-2 flex items-end justify-between">

                  <div>
                    <span className="text-4xl font-bold">
                      ₹{event.ticketPrice}
                    </span>

                    <span className="ml-2 text-sm text-slate-400">
                      / ticket
                    </span>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
                    <Ticket size={23} />
                  </div>

                </div>

              </div>

              <div className="p-7">

                {/* Date */}
                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Date
                    </p>

                    <p className="font-semibold text-slate-900">
                      {formattedDate}
                    </p>
                  </div>

                </div>

                {/* Time */}
                <div className="mt-5 flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Clock size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Time
                    </p>

                    <p className="font-semibold text-slate-900">
                      {event.time}
                    </p>
                  </div>

                </div>

                {/* Seats */}
                <div className="mt-5 flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Users size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Availability
                    </p>

                    <p
                      className={`font-semibold ${
                        isSoldOut
                          ? "text-red-600"
                          : isLowSeats
                          ? "text-orange-600"
                          : "text-slate-900"
                      }`}
                    >
                      {isSoldOut
                        ? "Sold out"
                        : `${event.availableSeats} seats left`}
                    </p>
                  </div>

                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-slate-200" />

                {/* Book button */}
                {isSoldOut ? (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-5 py-3.5 font-semibold text-slate-500"
                  >
                    Sold Out
                  </button>
                ) : (
                  <Link
                    to={`/events/${event._id}/book`}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 hover:shadow-xl"
                  >
                    <Ticket size={18} />
                    Book Tickets
                  </Link>
                )}

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">

                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    Your booking details are securely stored and you can
                    access your tickets anytime from My Bookings.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">

        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-12 sm:px-12">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 -left-10 h-56 w-56 rounded-full bg-white/10" />

          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">

            <div>

              <div className="flex items-center gap-2 text-indigo-200">
                <Sparkles size={18} />

                <span className="text-sm font-semibold">
                  Make it memorable
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Ready to experience {event.title}?
              </h2>

              <p className="mt-2 max-w-xl text-indigo-100">
                Grab your tickets before they're gone.
              </p>

            </div>

            {!isSoldOut && (
              <Link
                to={`/events/${event._id}/book`}
                className="shrink-0 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
              >
                Book Now
              </Link>
            )}

          </div>

        </div>

      </section>

    </div>
  );
};

export default EventDetails;