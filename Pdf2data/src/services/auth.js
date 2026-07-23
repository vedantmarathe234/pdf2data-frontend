import { API_BASE_URL } from "./api";

const BASE_URL = `${API_BASE_URL}/auth`;

export const registerUser = async (username, email, password, role, adminSecretKey) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      adminSecretKey: role === "ADMIN" ? adminSecretKey : "",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Registration failed.");
  }
  return response.text();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password.");
  }

  const data = await response.json();

  // Persist session — email isn't returned by the backend, so we keep
  // what the user typed to display it in the UI (Topbar / Settings).
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);
  localStorage.setItem("role", data.role);
  localStorage.setItem("email", email);

  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    username: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    role: localStorage.getItem("role") || "ROLE_USER",
    token,
  };
};
