import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import ExtractionPage from "./components/extractions/ExtractionPage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <DashboardLayout>

                <Dashboard />

              </DashboardLayout>

            </ProtectedRoute>
          }
        />
        <Route
            path="/extractions"
            element={
              <ProtectedRoute>

                <DashboardLayout>

                  <ExtractionPage />

                </DashboardLayout>

              </ProtectedRoute>
            }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>

    </BrowserRouter>
  );
}


export default App;