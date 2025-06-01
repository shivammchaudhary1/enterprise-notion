import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Workspace API functions
export const workspaceAPI = {
  // Get all user workspaces
  getUserWorkspaces: async () => {
    try {
      const response = await api.get("/workspaces");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get workspace by ID
  getWorkspaceById: async (workspaceId) => {
    try {
      const response = await api.get(`/workspaces/${workspaceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new workspace
  createWorkspace: async (workspaceData) => {
    try {
      const response = await api.post("/workspaces", workspaceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update workspace
  updateWorkspace: async (workspaceId, workspaceData) => {
    try {
      const response = await api.put(
        `/workspaces/${workspaceId}`,
        workspaceData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete workspace
  deleteWorkspace: async (workspaceId) => {
    try {
      const response = await api.delete(`/workspaces/${workspaceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add member to workspace
  addMember: async (workspaceId, memberData) => {
    try {
      const response = await api.post(
        `/workspaces/${workspaceId}/members`,
        memberData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove member from workspace
  removeMember: async (workspaceId, memberId) => {
    try {
      const response = await api.delete(
        `/workspaces/${workspaceId}/members/${memberId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update member role
  updateMemberRole: async (workspaceId, memberId, roleData) => {
    try {
      const response = await api.put(
        `/workspaces/${workspaceId}/members/${memberId}/role`,
        roleData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default workspaceAPI;
