import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Image,
  IndianRupee,
  MapPin,
  Save,
  Ticket,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../services/api";

const AdminEventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Music",
    date: "",
    time: "",
    venue: "",
    city: "",
    image: "",
    ticketPrice: "",
    totalSeats: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState("");

  // Load existing event when editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchEvent = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await api.get(`/events/${id}`);

        const event = response.data.event;

        setFormData({
          title: event.title || "",
          description: event.description || "",
          category: event.category || "Music",
          date: event.date
            ? event.date.split("T")[0]
            : "",
          time: event.time || "",
          venue: event.venue || "",
          city: event.city || "",
          image: event.image || "",
          ticketPrice: event.ticketPrice ?? "",
          totalSeats: event.totalSeats ?? "",
        });
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load this event."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchEvent();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const eventData = {
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
        totalSeats: Number(formData.totalSeats),
      };

      if (isEditMode) {
        await api.put(`/events/${id}`, eventData);
      } else {
        await api.post("/events", eventData);
      }

      navigate("/admin/events");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          `Unable to ${
            isEditMode ? "update" : "create"
          } event. Please check your details.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading event...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-6"
        >
          <ArrowLeft size={17} />
          Back to Events
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
            Administration
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            {isEditMode
              ? "Edit Event"
              : "Create New Event"}
          </h1>

          <p className="text-slate-500 mt-3">
            {isEditMode
              ? "Update the details of your event."
              : "Add a new event to the Eventora platform."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8"
        >
          {error && (
            <div className="mb-7 rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Basic Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Tell attendees what this event is about.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-6">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Delhi Music Night"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the event..."
                rows="5"
                required
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              >
                <option value="Music">Music</option>
                <option value="Technology">
                  Technology
                </option>
                <option value="Sports">Sports</option>
                <option value="Workshop">
                  Workshop
                </option>
                <option value="Conference">
                  Conference
                </option>
                <option value="Comedy">Comedy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event image URL
              </label>

              <div className="relative">
                <Image
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                />
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="border-t border-slate-100 mt-10 pt-8">

            <h2 className="text-xl font-bold text-slate-900">
              Date & Location
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Tell attendees when and where the event takes place.
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time
                </label>

                <div className="relative">
                  <Clock3
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="e.g. 7:00 PM"
                    required
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Venue
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="e.g. Jawahar Lal Nehru Stadium"
                    required
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Delhi"
                    required
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="border-t border-slate-100 mt-10 pt-8">

            <h2 className="text-xl font-bold text-slate-900">
              Ticket Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Set pricing and seating capacity.
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ticket price
                </label>

                <div className="relative">
                  <IndianRupee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    placeholder="799"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              {/* Seats */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total seats
                </label>

                <div className="relative">
                  <Ticket
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                    required
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 mt-10 pt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">

            <Link
              to="/admin/events"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60"
            >
              <Save size={18} />

              {loading
                ? isEditMode
                  ? "Saving Changes..."
                  : "Creating Event..."
                : isEditMode
                ? "Save Changes"
                : "Create Event"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventForm;