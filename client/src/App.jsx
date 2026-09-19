import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import BookEvent from "./pages/BookEvent";
import BookingSuccess from "./pages/BookingSuccess";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";

import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminEventForm from "./pages/AdminEventForm";
import AdminBookings from "./pages/AdminBookings";
import AdminReports from "./pages/AdminReports";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/events" element={<Events />} />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />

          <Route
            path="/events/:id/book"
            element={<BookEvent />}
          />

          <Route
            path="/booking-success/:bookingId"
            element={<BookingSuccess />}
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* User */}
          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/events"
              element={<AdminEvents />}
            />

            <Route 
              path="/admin/bookings"
              element={<AdminBookings />} 
              />

            <Route
              path="/admin/events/new"
              element={<AdminEventForm />}
            />

            <Route
              path="/admin/reports"
              element={<AdminReports />}
            />

            <Route
              path="/admin/events/edit/:id"
              element={<AdminEventForm />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;