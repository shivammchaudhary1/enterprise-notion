import axios from "axios";
import config from "../../lib/default.js";

const API_URL = `${config.BACKEND_URL}/api`;

// Create axios instance with interceptors
const createAPI = () => {
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth token to requests
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error("AI API Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("AI API Response error:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Create API instance
const api = createAPI();

// AI API functions
export const aiAPI = {
  // Generate meeting notes
  generateMeetingNotes: async (transcript) => {
    try {
      const response = await api.post("/ai/meeting-notes", { transcript });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate semantic tags
  generateTags: async (content, existingTags = []) => {
    try {
      const response = await api.post("/ai/generate-tags", {
        content,
        existingTags,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default aiAPI;
