import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">

          {/* Text */}
          <div className="max-w-2xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-indigo-200 backdrop-blur">
              <Sparkles size={16} />
              Discover experiences worth remembering
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your next
              <span className="block text-indigo-400">
                unforgettable
              </span>
              event starts here.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Discover concerts, workshops, conferences and experiences
              happening around you. Find your event, book your tickets,
              and make memories.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                to="/events"
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-indigo-950/30 transition hover:bg-indigo-500"
              >
                Explore Events
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Create Account
              </Link>

            </div>
          </div>

          {/* Hero card */}
          <div className="hidden lg:block">

            <div className="relative mx-auto max-w-md">

              <div className="absolute -inset-4 rounded-[2rem] bg-indigo-500/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">

                <img
                  src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
                  alt="Live event"
                  className="h-[440px] w-full rounded-[1.5rem] object-cover"
                />

                <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl">

                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-600 p-3 text-white">
                      <CalendarDays size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        Delhi Music Night
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-sm text-slate-300">
                        <MapPin size={14} />
                        Delhi
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Feature section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="max-w-2xl">
          <p className="font-semibold text-indigo-600">
            EVERYTHING IN ONE PLACE
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find something you'll love.
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            From live music to learning experiences, Eventora makes
            discovering and booking events simple.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {[
            {
              title: "Discover",
              text: "Explore upcoming events and find experiences that match your interests.",
              icon: Sparkles,
            },
            {
              title: "Book",
              text: "Reserve your tickets with a simple and secure booking process.",
              icon: CalendarDays,
            },
            {
              title: "Experience",
              text: "Keep your bookings organized and never miss an event.",
              icon: MapPin,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            );
          })}

        </div>

      </section>

    </div>
  );
};

export default Home;