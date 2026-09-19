import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  User,
  IndianRupee,
  Printer,
  ArrowLeft,
  Download,
} from "lucide-react";

import api from "../services/api";

const BookingSuccess = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/bookings/${bookingId}`
        );

        setBooking(response.data.booking);
      } catch (error) {
        console.error("Failed to load booking:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="text-slate-500">
            Loading your booking...
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Ticket className="text-red-500" size={26} />
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Booking not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "We couldn't find the booking you're looking for."}
          </p>

          <Link
            to="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const event = booking.event;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="mb-8 text-center print:mb-5">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2
              size={38}
              className="text-emerald-500"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Booking Confirmed!
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-slate-500">
            Your event booking has been successfully confirmed.
            Keep this ticket handy for the event.
          </p>
        </div>

        {/* Ticket */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl print:rounded-none print:border print:shadow-none">
          {/* Ticket Header */}
          <div className="bg-slate-950 px-6 py-6 text-white sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
                  Eventora
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Digital Event Ticket
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
                <CheckCircle2 size={17} />
                {booking.bookingStatus === "confirmed"
                  ? "Confirmed"
                  : "Cancelled"}
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            {/* Image */}
            <div className="relative min-h-[240px] bg-slate-100">
              {event?.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full min-h-[240px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[240px] items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-100">
                  <Ticket
                    size={64}
                    className="text-indigo-300"
                  />
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="p-6 sm:p-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                {event?.category || "Event"}
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                {event?.title || "Event"}
              </h2>

              <div className="mt-6 space-y-4">
                <InfoRow
                  icon={<CalendarDays size={19} />}
                  label="Date"
                  value={formatDate(event?.date)}
                />

                <InfoRow
                  icon={<Clock3 size={19} />}
                  label="Time"
                  value={event?.time || "—"}
                />

                <InfoRow
                  icon={<MapPin size={19} />}
                  label="Venue"
                  value={`${event?.venue || "—"}${
                    event?.city
                      ? `, ${event.city}`
                      : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="relative border-t border-dashed border-slate-300">
            <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
            <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
          </div>

          {/* Booking Details */}
          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            <DetailItem
              icon={<User size={18} />}
              label="Booked By"
              value={booking.user?.name || "User"}
            />

            <DetailItem
              icon={<Ticket size={18} />}
              label="Tickets"
              value={booking.numberOfTickets}
            />

            <DetailItem
              icon={<IndianRupee size={18} />}
              label="Total Amount"
              value={`₹${Number(
                booking.totalAmount || 0
              ).toLocaleString("en-IN")}`}
            />

            <DetailItem
              icon={<Ticket size={18} />}
              label="Booking Reference"
              value={booking.bookingReference}
              mono
            />
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
            <p className="text-center text-xs leading-5 text-slate-500">
              Please carry your booking reference when attending
              the event. This confirmation is generated by
              Eventora.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Printer size={18} />
            Print Ticket
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Download size={18} />
            Save Ticket
          </button>

          <Link
            to="/my-bookings"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View My Bookings
          </Link>
        </div>

        <div className="mt-5 text-center print:hidden">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={16} />
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-indigo-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
  mono = false,
}) => {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p
        className={`font-semibold text-slate-800 ${
          mono
            ? "break-all font-mono text-sm"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default BookingSuccess;