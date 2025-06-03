import axios from "axios";
import config from "../../lib/default.js";

const API_URL = `${config.BACKEND_URL}/api/assistant`;

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error Response:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Assistant API functions
export const assistantAPI = {
  // Query the assistant
  query: async (message, history, workspaceId) => {
    try {
      console.log("Sending request to assistant API:", {
        question: message,
        historyLength: history?.length || 0,
        history: history,
        workspaceId: workspaceId,
      });

      const response = await axiosInstance.post("/query", {
        question: message,
        conversationHistory: history || [],
        workspaceId: workspaceId,
      });

      if (!response.data) {
        throw new Error("No data received from API");
      }

      return response.data;
    } catch (error) {
      console.error("Assistant API Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error.response?.data || error;
    }
  },
};

export default assistantAPI;
