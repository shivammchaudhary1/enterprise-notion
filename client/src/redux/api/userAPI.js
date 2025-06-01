import axios from "axios";
import config from "../../lib/default.js";

const API_URL = `${config.BACKEND_URL}/api/user`;

// Create axios instance with default config
const userAPI = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token
userAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
userAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await userAPI.get("/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await userAPI.put("/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user preferences
export const getUserPreferences = async () => {
  try {
    const response = await userAPI.get("/preferences");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user preferences
export const updateUserPreferences = async (preferences) => {
  try {
    const response = await userAPI.put("/preferences", preferences);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default userAPI;
