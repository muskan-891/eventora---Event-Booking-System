import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";
import api from "../services/api";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="h-[500px] animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Event not found
          </h1>

          <p className="mt-2 text-slate-500">
            We couldn't find the event you're looking for.
          </p>

          <Link
            to="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero image */}
      <section className="relative h-[420px] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">

            <Link
              to="/events"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to Events
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white">
                {event.category}
              </span>

              <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
                {event.availableSeats} seats available
              </span>
            </div>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {event.title}
            </h1>

          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_380px] lg:px-8">

        {/* Main content */}
        <div>

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <CalendarDays
                size={22}
                className="text-indigo-600"
              />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Date
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {new Date(event.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <Clock
                size={22}
                className="text-indigo-600"
              />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Time
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {event.time}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <MapPin
                size={22}
                className="text-indigo-600"
              />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Location
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {event.city}
              </p>
            </div>

          </div>

          {/* About */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-2xl font-bold text-slate-900">
              About this event
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              {event.description}
            </p>
          </div>

          {/* Venue */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-2xl font-bold text-slate-900">
              Venue
            </h2>

            <div className="mt-4 flex items-start gap-3">
              <MapPin className="mt-1 text-indigo-600" size={20} />

              <div>
                <p className="font-semibold text-slate-900">
                  {event.venue}
                </p>

                <p className="mt-1 text-slate-500">
                  {event.city}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Booking card */}
        <aside>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Ticket price
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  ₹{event.ticketPrice}
                </p>
              </div>

              <Ticket className="text-indigo-600" size={28} />
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Available seats
              </span>

              <span className="font-semibold text-slate-900">
                {event.availableSeats}
              </span>
            </div>

            <Link
              to={`/events/${event._id}/book`}
              className="mt-6 block rounded-xl bg-indigo-600 px-5 py-3.5 text-center font-semibold text-white transition hover:bg-indigo-700"
            >
              Book Tickets
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              You'll be able to select the number of tickets on the next step.
            </p>

          </div>
        </aside>

      </section>
    </div>
  );
};

export default EventDetails;