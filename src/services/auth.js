import api, { API_BASE_URL } from "./api"; // 1. Imported 'api' instance

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


export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const changeEmail = async (newEmail, password) => {
  const response = await api.put("/auth/change-email", {
    newEmail,
    password,
  });
  return response.data;
};

export const updateProfile = async (username, profilePicture) => {
  const response = await api.put("/auth/profile", {
    username,
    profilePicture,
  });
  return response.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/auth/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};