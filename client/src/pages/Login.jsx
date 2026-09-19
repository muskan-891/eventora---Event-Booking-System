import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Lock, Mail } from "lucide-react";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/events";

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

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("eventora_token", response.data.token);

if (response.data.user) {
  localStorage.setItem(
    "eventora_user",
    JSON.stringify(response.data.user)
  );
}

window.dispatchEvent(new Event("eventora-auth-change"));

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100">

        {/* Left Side */}
        <div className="hidden md:flex bg-slate-950 text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                <CalendarDays size={21} />
              </div>

              <span className="text-2xl font-bold">
                Eventora
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Your next unforgettable experience is waiting.
            </h1>

            <p className="mt-5 text-slate-300 leading-7">
              Discover events, reserve your tickets and keep all your
              bookings organized in one place.
            </p>
          </div>

          <p className="text-sm text-slate-400">
            Discover. Book. Experience.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600 mb-2">
              WELCOME BACK
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Sign in to Eventora
            </h2>

            <p className="text-slate-500 mt-2">
              Continue your event journey.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;