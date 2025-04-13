import { Navigate, Outlet } from "react-router-dom";
import DashboardDrawer from "./Drawer";
import { api } from "../../utils/api";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const success = await trySilentRefresh();
      
      if (!success) {
        sessionStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      setIsAuthenticated(true);

      setIsLoading(false);
    };

    const trySilentRefresh = async () => {
      try {
        const res = await api.accessToken(); // assumes this sets new access token

        if (res.success) {
          sessionStorage.setItem("accessToken", JSON.stringify(res.data));
          return true
        }
        return false;
      } catch (e) {
        console.error("Silent refresh failed", e);
        return false;
      }
    };

    verifySession();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return (
    <div className="dashboard-layout">
      <DashboardDrawer />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
