import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import DashboardHome from "./pages/dashboard/Home";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import { DashboardProvider } from "./pages/dashboard/context/DashboardContext";
import MyPolicy from "./pages/dashboard/policies/MyPolicy";
import PolicyDetail from "./pages/dashboard/policies/PolicyDetail";
import NewUserPolicy from "./pages/dashboard/policies/NewUserPolicy";
import PublicRoute from "./components/PublicRoute";
import DashboardProfile from "./pages/dashboard/profile/DashboardProfile";
import Footer from "./components/Footer";
import Box from "@mui/material/Box";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <DashboardProvider>
        <BrowserRouter>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh", // full height of viewport
            }}
          >
            <Header />
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/auth" element={<PublicRoute />}>
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<SignUp />} />
                </Route>

                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="policies" element={<MyPolicy />} />
                  <Route
                    path="policies/:userPolicyId"
                    element={<PolicyDetail />}
                  />
                  <Route path="policies/new" element={<NewUserPolicy />} />
                  <Route path="profile" element={<DashboardProfile />} />

                  <Route
                    element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
                  >
                    <Route path="admin" element={<DashboardProfile />} />
                  </Route>
                </Route>
              </Routes>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      </DashboardProvider>
    </>
  );
}

export default App;
