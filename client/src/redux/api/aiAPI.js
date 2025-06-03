import axios from "axios";
import config from "../../lib/default.js";

const API_URL = `${config.BACKEND_URL}/api`;

// Create axios instance
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
    return Promise.reject(error);
  }
);

// AI API functions
export const aiAPI = {
  // Generate meeting notes from transcript
  generateMeetingNotes: async (transcript) => {
    try {
      const response = await api.post("/ai/meeting-notes", { transcript });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default aiAPI;
