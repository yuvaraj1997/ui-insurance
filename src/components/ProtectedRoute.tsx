import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../types";
import { useDashboard } from "../pages/dashboard/context/DashboardContext";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles } : ProtectedRouteProps) => {

  const { user } = useDashboard();

  if (!user) {
    return <></>
  }

  const isAllowed = user && allowedRoles.some(role => user.roles.includes(role));

  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
