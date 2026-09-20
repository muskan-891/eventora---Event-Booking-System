import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Ticket,
  Sparkles,
  Music2,
  Laptop2,
  Trophy,
  Laugh,
  Palette,
  Users,
  Heart,
} from "lucide-react";

const Home = () => {
  const categories = [
    {
      name: "Music",
      description: "Live sounds & unforgettable nights",
      icon: Music2,
    },
    {
      name: "Technology",
      description: "Ideas shaping tomorrow",
      icon: Laptop2,
    },
    {
      name: "Comedy",
      description: "Laugh a little louder",
      icon: Laugh,
    },
    {
      name: "Sports",
      description: "Feel the thrill",
      icon: Trophy,
    },
    {
      name: "Workshops",
      description: "Learn, create & grow",
      icon: Palette,
    },
  ];

  const featuredEvents = [
    {
      title: "Delhi Music Night",
      category: "Music",
      date: "20 Nov 2026",
      venue: "JLN Stadium",
      city: "New Delhi",
      price: "₹799",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Future of AI Summit",
      category: "Technology",
      date: "28 Nov 2026",
      venue: "India Expo Centre",
      city: "Greater Noida",
      price: "₹1,499",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Laugh Out Loud",
      category: "Comedy",
      date: "5 Dec 2026",
      venue: "Siri Fort Auditorium",
      city: "New Delhi",
      price: "₹599",
      image:
        "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  return (
    <div className="bg-[#f8f7f4] text-slate-900">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#101827] text-white">
        {/* Decorative shapes */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">

            {/* Hero text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
                <Sparkles
                  size={15}
                  className="text-indigo-300"
                />
                Discover something worth remembering
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Find your next
                <span className="block text-indigo-300">
                  great experience.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                From live music and creative workshops to
                technology conferences and nights filled with
                laughter, discover events that make ordinary
                days a little more memorable.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/events"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-900 transition hover:bg-indigo-50"
                >
                  Explore Events
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  <CalendarDays size={18} />
                  See What's Happening
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Ticket size={16} />
                  Simple booking
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  Instant confirmation
                </div>

                <div className="flex items-center gap-2">
                  <Heart size={16} />
                  Experiences you'll love
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-indigo-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=90"
                  alt="People enjoying a live event"
                  className="h-[430px] w-full rounded-[1.5rem] object-cover sm:h-[500px]"
                />

                {/* Floating event card */}
                <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-slate-950/75 p-5 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                        Featured tonight
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        Live experiences await
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                        <MapPin size={14} />
                        Delhi & NCR
                      </div>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Ticket size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO / STATS
      ===================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3 lg:px-8">

          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <CalendarDays size={21} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Discover more
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Find experiences across music, technology,
                comedy, sports and more.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Ticket size={21} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Book effortlessly
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose your event, select your tickets and
                you're ready to go.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users size={21} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Make memories
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Turn free evenings and weekends into stories
                worth telling.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          FEATURED EVENTS
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Don't miss out
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Experiences worth showing up for.
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500">
              A few things happening soon. Find something that
              matches your mood and make a plan.
            </p>
          </div>

          <Link
            to="/events"
            className="group inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all events
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {featuredEvents.map((event) => (
            <Link
              to="/events"
              key={event.title}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 backdrop-blur">
                  {event.category}
                </div>

                <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/85 px-3 py-2 text-sm font-bold text-white backdrop-blur">
                  {event.price}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {event.title}
                </h3>

                <div className="mt-4 space-y-2.5 text-sm text-slate-500">

                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={16}
                      className="text-indigo-600"
                    />
                    {event.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      className="text-indigo-600"
                    />
                    {event.venue}, {event.city}
                  </div>

                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  Explore event
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Explore by interest
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What are you in the mood for?
            </h2>

            <p className="mt-3 text-slate-500">
              Whether you're looking for a night out, a new
              skill, fresh ideas or a little adrenaline, there's
              something waiting for you.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  to="/events"
                  className="group rounded-2xl border border-slate-200 bg-[#fafaf9] p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-slate-500">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    Explore
                    <ArrowRight size={13} />
                  </div>
                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================================
          STORY SECTION
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-[#101827]">

          <div className="grid lg:grid-cols-2">

            <div className="p-8 text-white sm:p-12 lg:p-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
                More than a booking
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Your calendar has dates.
                <span className="block text-indigo-300">
                  Make them memories.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-7 text-slate-300">
                Eventora was created to make discovering and
                booking experiences feel simple. No endless
                searching. No complicated booking journey.
                Just find something interesting, make a plan,
                and show up.
              </p>

              <Link
                to="/events"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-900 transition hover:bg-indigo-50"
              >
                Start exploring
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="relative min-h-[360px]">
              <img
                src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=85"
                alt="People enjoying an event together"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#101827] via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Sparkles size={25} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your next experience is out there.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
            Take a break from the usual routine. Discover
            something new, invite someone along and make
            plans you'll actually look forward to.
          </p>

          <Link
            to="/events"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
          >
            Explore all events
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Home;