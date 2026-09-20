import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  CalendarDays,
  ChevronDown,
  MapPin,
  Search,
  Sparkles,
  Ticket,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data.events || []);
      } catch (error) {
        console.error(error);
        setError("Unable to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(events.map((event) => event.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((event) => {
        return (
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query) ||
          event.city?.toLowerCase().includes(query) ||
          event.venue?.toLowerCase().includes(query)
        );
      });
    }

    // Category
    if (category !== "All") {
      result = result.filter((event) => event.category === category);
    }

    // Sort
    if (sortBy === "date") {
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.ticketPrice - b.ticketPrice);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.ticketPrice - a.ticketPrice);
    }

    if (sortBy === "seats") {
      result.sort((a, b) => b.availableSeats - a.availableSeats);
    }

    return result;
  }, [events, search, category, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("date");
  };

  const hasFilters =
    search.trim() !== "" || category !== "All" || sortBy !== "date";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================================================
          HERO / HEADER
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950">

        {/* Background decoration */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-indigo-200 backdrop-blur">
              <Sparkles size={16} />
              Discover something unforgettable
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your next
              <span className="block text-indigo-400">
                great experience.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              From live music and comedy nights to technology summits,
              creative workshops and unforgettable experiences — discover
              events happening around you.
            </p>

          </div>

          {/* Search */}
          <div className="mt-10 max-w-3xl">

            <div className="flex items-center rounded-2xl border border-white/10 bg-white p-2 shadow-2xl">

              <div className="flex flex-1 items-center gap-3 px-4">

                <Search
                  size={21}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, locations, categories..."
                  className="w-full bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={17} />
                  </button>
                )}

              </div>

              <button
                onClick={() => {
                  document
                    .getElementById("events-list")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hidden rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:block"
              >
                Search
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          FILTER BAR
      ========================================================= */}
      <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1">

              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    category === item
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>

            {/* Sort */}
            <div className="relative shrink-0">

              <div className="flex items-center gap-2">

                <ArrowDownUp
                  size={17}
                  className="text-slate-400"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="date">Sort by date</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="seats">Most seats available</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 text-slate-400"
                />

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          EVENTS CONTENT
      ========================================================= */}
      <main
        id="events-list"
        className="mx-auto max-w-7xl px-6 py-12 lg:px-8"
      >

        {/* Results heading */}
        {!loading && !error && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Upcoming experiences
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Explore all events
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"} found
              </p>

            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
              >
                <X size={16} />
                Clear filters
              </button>
            )}

          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}
        {loading && (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className="h-60 animate-pulse bg-slate-200" />

                <div className="space-y-4 p-6">

                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-10 animate-pulse rounded-xl bg-slate-200" />

                </div>
              </div>
            ))}

          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}
        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <CalendarDays size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-red-900">
              Something went wrong
            </h2>

            <p className="mt-2 text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* =====================================================
            EMPTY DATABASE
        ===================================================== */}
        {!loading && !error && events.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-24 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No events yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              There aren't any events available right now. Check back soon
              for new experiences.
            </p>

          </div>
        )}

        {/* =====================================================
            NO SEARCH RESULTS
        ===================================================== */}
        {!loading &&
          !error &&
          events.length > 0 &&
          filteredEvents.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-24 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Search size={28} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No matching events
              </h2>

              <p className="mx-auto mt-2 max-w-md text-slate-500">
                We couldn't find anything matching your search or filters.
                Try another keyword or category.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Show all events
              </button>

            </div>
          )}

        {/* =====================================================
            EVENT GRID
        ===================================================== */}
        {!loading &&
          !error &&
          filteredEvents.length > 0 && (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

              {filteredEvents.map((event) => {

                const isLowSeats =
                  event.availableSeats <=
                  Math.max(10, Math.floor(event.totalSeats * 0.15));

                return (
                  <article
                    key={event._id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-2xl"
                  >

                    {/* Image */}
                    <div className="relative h-60 overflow-hidden bg-slate-200">

                      <img
                        src={event.image || fallbackImage}
                        alt={event.title}
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                      {/* Gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Category */}
                      <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
                        {event.category}
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/85 px-3.5 py-2 text-sm font-bold text-white shadow-lg backdrop-blur">
                        ₹{event.ticketPrice}
                      </div>

                    </div>

                    {/* Content */}
                    <div className="p-6">

                      <h2 className="line-clamp-1 text-xl font-bold tracking-tight text-slate-900">
                        {event.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {event.description}
                      </p>

                      {/* Details */}
                      <div className="mt-5 space-y-3">

                        <div className="flex items-start gap-3 text-sm text-slate-600">

                          <CalendarDays
                            size={17}
                            className="mt-0.5 shrink-0 text-indigo-600"
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
                            <span className="mx-1.5 text-slate-300">
                              ·
                            </span>
                            {event.time}
                          </span>

                        </div>

                        <div className="flex items-start gap-3 text-sm text-slate-600">

                          <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-indigo-600"
                          />

                          <span className="line-clamp-1">
                            {event.venue}, {event.city}
                          </span>

                        </div>

                        <div className="flex items-center gap-3 text-sm">

                          <Ticket
                            size={17}
                            className="shrink-0 text-indigo-600"
                          />

                          <span
                            className={
                              isLowSeats
                                ? "font-semibold text-orange-600"
                                : "text-slate-600"
                            }
                          >
                            {event.availableSeats} seats available
                          </span>

                          {isLowSeats && (
                            <span className="rounded-full bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-600">
                              Filling fast
                            </span>
                          )}

                        </div>

                      </div>

                      {/* Divider */}
                      <div className="my-5 h-px bg-slate-100" />

                      {/* Bottom */}
                      <div className="flex items-center justify-between gap-4">

                        <div>
                          <p className="text-xs text-slate-400">
                            Starting from
                          </p>

                          <p className="mt-0.5 text-lg font-bold text-slate-900">
                            ₹{event.ticketPrice}
                          </p>
                        </div>

                        <Link
                          to={`/events/${event._id}`}
                          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
                        >
                          View Event
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </main>

      {/* =========================================================
          BOTTOM CTA
      ========================================================= */}
      {!loading && !error && events.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-12 text-center sm:px-12">

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-white/10" />

            <div className="relative">

              <Sparkles
                size={28}
                className="mx-auto text-indigo-200"
              />

              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                Your next memorable experience is waiting.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-indigo-100">
                Pick an event, grab your tickets, and make some memories.
              </p>

            </div>

          </div>

        </section>
      )}

    </div>
  );
};

export default Events;