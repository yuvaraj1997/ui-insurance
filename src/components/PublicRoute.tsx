import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
