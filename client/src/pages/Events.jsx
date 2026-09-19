import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Search, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data.events);
      } catch (error) {
        console.error(error);
        setError("Unable to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <p className="font-semibold uppercase tracking-wider text-indigo-600">
            Discover
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Explore Events
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Find concerts, workshops, conferences and experiences
                waiting for you.
              </p>
            </div>

            {/* Search UI */}
            <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:max-w-sm">
              <Search size={19} className="text-slate-400" />

              <input
                type="text"
                placeholder="Search events..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Events */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-slate-200" />

                <div className="space-y-4 p-6">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}

          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
            <CalendarDays
              size={42}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No events yet
            </h2>

            <p className="mt-2 text-slate-500">
              Check back soon for upcoming events.
            </p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            {events.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Image */}
                <div className="relative h-56 overflow-hidden">

                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur">
                    {event.category}
                  </div>

                  <div className="absolute bottom-4 right-4 rounded-lg bg-slate-950/80 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
                    ₹{event.ticketPrice}
                  </div>

                </div>

                {/* Content */}
                <div className="p-6">

                  <h2 className="line-clamp-1 text-xl font-bold text-slate-900">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CalendarDays
                        size={17}
                        className="text-indigo-600"
                      />

                      <span>
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · {event.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin
                        size={17}
                        className="text-indigo-600"
                      />

                      <span>
                        {event.venue}, {event.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Ticket
                        size={17}
                        className="text-indigo-600"
                      />

                      <span>
                        {event.availableSeats} seats available
                      </span>
                    </div>

                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="mt-6 block rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View Event
                  </Link>

                </div>
              </article>
            ))}

          </div>
        )}

      </section>
    </div>
  );
};

export default Events;