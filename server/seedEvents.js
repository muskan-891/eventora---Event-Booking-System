const mongoose = require("mongoose");
require("dotenv").config();

const Event = require("./models/Event");
const User = require("./models/User");

const events = [
  {
    title: "Delhi Music Night",
    description:
      "An energetic evening of live music, incredible performances, and unforgettable moments featuring talented artists from across Delhi.",
    category: "Music",
    date: new Date("2026-11-20"),
    time: "7:00 PM",
    venue: "Jawaharlal Nehru Stadium",
    city: "New Delhi",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 799,
    totalSeats: 500,
  },

  {
    title: "Future of AI Summit",
    description:
      "Explore the future of artificial intelligence, emerging technologies, automation, and the ideas shaping tomorrow's digital world.",
    category: "Technology",
    date: new Date("2026-11-28"),
    time: "10:00 AM",
    venue: "India Expo Mart",
    city: "Greater Noida",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 1499,
    totalSeats: 300,
  },

  {
    title: "Laugh Out Loud",
    description:
      "A hilarious stand-up comedy evening featuring fresh jokes, relatable stories, and plenty of laughter.",
    category: "Comedy",
    date: new Date("2026-12-05"),
    time: "8:00 PM",
    venue: "Siri Fort Auditorium",
    city: "New Delhi",
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 599,
    totalSeats: 350,
  },

  {
    title: "Indie Artists Live",
    description:
      "Discover independent musicians and experience a beautiful night filled with original music and intimate performances.",
    category: "Music",
    date: new Date("2026-12-12"),
    time: "6:30 PM",
    venue: "The Piano Man Jazz Club",
    city: "New Delhi",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 899,
    totalSeats: 250,
  },

  {
    title: "Startup Founders Meetup",
    description:
      "Meet entrepreneurs, founders, developers, and creators to exchange ideas, build connections, and discuss the startup ecosystem.",
    category: "Conference",
    date: new Date("2026-12-18"),
    time: "11:00 AM",
    venue: "Noida International Centre",
    city: "Noida",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 699,
    totalSeats: 400,
  },

  {
    title: "Weekend Photography Workshop",
    description:
      "Learn photography fundamentals, composition, lighting, and practical shooting techniques in this hands-on workshop.",
    category: "Workshop",
    date: new Date("2027-01-09"),
    time: "10:00 AM",
    venue: "India Habitat Centre",
    city: "Delhi",
    image:
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 999,
    totalSeats: 100,
  },

  {
    title: "Delhi Marathon Experience",
    description:
      "Take part in an exciting running experience celebrating fitness, community, energy, and an active lifestyle.",
    category: "Sports",
    date: new Date("2027-01-17"),
    time: "6:00 AM",
    venue: "India Gate",
    city: "New Delhi",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 499,
    totalSeats: 1000,
  },

  {
    title: "Creative Design Lab",
    description:
      "A practical creative workshop covering UI design, visual thinking, design systems, and modern digital experiences.",
    category: "Workshop",
    date: new Date("2027-01-23"),
    time: "11:00 AM",
    venue: "91Springboard",
    city: "Gurugram",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 1199,
    totalSeats: 150,
  },

  {
    title: "The Business Connect",
    description:
      "Connect with professionals and entrepreneurs while exploring ideas, partnerships, leadership, and business opportunities.",
    category: "Conference",
    date: new Date("2027-02-05"),
    time: "10:30 AM",
    venue: "Crowne Plaza",
    city: "Noida",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 899,
    totalSeats: 300,
  },

  {
    title: "Open Mic Evening",
    description:
      "An intimate open mic featuring stand-up comedy, poetry, music, storytelling, and talented local performers.",
    category: "Comedy",
    date: new Date("2027-02-13"),
    time: "7:30 PM",
    venue: "The Laugh Store",
    city: "New Delhi",
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 399,
    totalSeats: 180,
  },

  {
    title: "Electronic Nights",
    description:
      "Experience an immersive night of electronic music, powerful beats, incredible visuals, and an energetic crowd.",
    category: "Music",
    date: new Date("2027-02-20"),
    time: "9:00 PM",
    venue: "Pragati Maidan",
    city: "Delhi",
    image:
      "https://images.unsplash.com/photo-1571266028243-d220c13f0a34?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 1099,
    totalSeats: 700,
  },

  {
    title: "Tech Innovation Summit",
    description:
      "Discover emerging technologies, innovation strategies, digital transformation, and the future of technology.",
    category: "Technology",
    date: new Date("2027-03-06"),
    time: "9:30 AM",
    venue: "DLF CyberHub",
    city: "Gurugram",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    ticketPrice: 1299,
    totalSeats: 350,
  },
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    const admin = await User.findOne({
      email: "admin@eventora.com",
    });

    if (!admin) {
      console.log("Admin user not found.");
      console.log("Please make sure admin@eventora.com exists.");
      process.exit(1);
    }

    let added = 0;
    let skipped = 0;

    for (const eventData of events) {
      const existingEvent = await Event.findOne({
        title: eventData.title,
      });

      if (existingEvent) {
        console.log(`Skipped: ${eventData.title}`);
        skipped++;
        continue;
      }

      await Event.create({
        ...eventData,
        availableSeats: eventData.totalSeats,
        organizer: admin._id,
      });

      console.log(`Added: ${eventData.title}`);
      added++;
    }

    console.log("\n-----------------------------");
    console.log("Event seeding completed!");
    console.log(`Added: ${added}`);
    console.log(`Skipped: ${skipped}`);
    console.log("-----------------------------");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedEvents();