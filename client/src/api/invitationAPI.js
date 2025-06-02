import axios from "axios";
import config from "../lib/default.js";

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

// Invitation API functions
export const invitationAPI = {
  // Get invitation by token
  getByToken: async (token) => {
    try {
      const response = await api.get(`/invitations/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Accept invitation
  accept: async (token) => {
    try {
      const response = await api.post(`/invitations/${token}/accept`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel invitation (by ID)
  cancel: async (invitationId) => {
    try {
      const response = await api.delete(`/invitations/${invitationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Resend invitation
  resend: async (invitationId) => {
    try {
      const response = await api.post(`/invitations/${invitationId}/resend`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get workspace invitations (for admins)
  getWorkspaceInvitations: async (workspaceId) => {
    try {
      const response = await api.get(`/invitations/workspace/${workspaceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default invitationAPI;
