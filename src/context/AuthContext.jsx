import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const navigate = useNavigate();

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
