// In-memory token storage (more secure than localStorage)
let authToken = null;

// Base API URL - adjust based on your backend port
const API_BASE_URL = "http://localhost:4567/api/auth";

// Token management
export const setToken = (token) => {
  authToken = token;
};

export const getToken = () => {
  return authToken;
};

export const clearToken = () => {
  authToken = null;
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
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
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
