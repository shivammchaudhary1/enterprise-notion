import config from "../../lib/default.js";

// Token storage key for localStorage
const TOKEN_KEY = "auth_token";

// In-memory token storage as fallback
let authToken = null;

// Base API URL - adjust based on your backend port
const API_BASE_URL = `${config.BACKEND_URL}/api/auth`;

// Token management with localStorage persistence
export const setToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getToken = () => {
  // Try to get token from memory first, then localStorage
  if (authToken) {
    return authToken;
  }
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    authToken = token;
  }
  return token;
};

export const clearToken = () => {
  authToken = null;
  localStorage.removeItem(TOKEN_KEY);
};

// API request helper with automatic token inclusion
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw {
        response: {
          data: data,
          status: response.status,
        },
      };
    }

    return { data };
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw {
        response: {
          data: {
            message:
              "Network error. Please check your connection and try again.",
          },
          status: 0,
        },
      };
    }
    throw error;
  }
};

// Auth API endpoints
export const register = async (userData) => {
  return apiRequest(`${API_BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials) => {
  return apiRequest(`${API_BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = async () => {
  return apiRequest(`${API_BASE_URL}/me`, {
    method: "GET",
  });
};

export const logout = async () => {
  // Clear token from memory
  clearToken();
  // Note: Since we're not using sessions, logout is primarily client-side
  return Promise.resolve();
};

export const forgotPassword = async (email) => {
  return apiRequest(`${API_BASE_URL}/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token, password) => {
  return apiRequest(`${API_BASE_URL}/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
};
