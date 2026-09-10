import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Extractions from "./pages/Extractions";
import Settings from "./pages/Settings";
import ChatSession from "./pages/ChatSession";
import AdminDashboard from "./pages/AdminDashboard";
import AdminExtractions from "./pages/AdminExtractions";
import AdminUsers from "./pages/AdminUsers";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  const isAdmin =
    user?.role === "ROLE_ADMIN" ||
    user?.role === "ADMIN" ||
    localStorage.getItem("role") === "ROLE_ADMIN";

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}


function MainAppContainer({ dark, setDark }) {
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin =
    user?.role === "ROLE_ADMIN" ||
    user?.role === "ADMIN" ||
    localStorage.getItem("role") === "ROLE_ADMIN";

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const isDashboard = location.pathname === "/dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <DashboardLayout
      dark={dark}
      setDark={setDark}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
    >
      <div
        style={{ display: isDashboard ? "block" : "none" }}
        className="w-full flex-1"
      >
        <Dashboard />
      </div>

      {!isDashboard && (
        <div className="w-full flex-1">
          <Routes>
            <Route path="extractions" element={<Extractions />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="chat/:sessionId" element={<ChatSession />} />
          </Routes>
        </div>
      )}
    </DashboardLayout>
  );
}

function AdminAppContainer({ dark, setDark }) {
  return (
    <AdminLayout dark={dark} setDark={setDark}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="extractions" element={<AdminExtractions />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
}


export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/signup" element={<Register />} />
            <Route
              path="/admin/register"
              element={<Navigate to="/admin/signup" replace />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminAppContainer dark={dark} setDark={setDark} />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainAppContainer dark={dark} setDark={setDark} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}