import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("eventora_token");
  const storedUser = localStorage.getItem("eventora_user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    if (user.role !== "admin") {
      return <Navigate to="/events" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error(error);

    localStorage.removeItem("eventora_token");
    localStorage.removeItem("eventora_user");

    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;