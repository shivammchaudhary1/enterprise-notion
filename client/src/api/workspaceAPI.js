import { api } from "./api";

// Workspace API functions
export const workspaceAPI = {
  // Get public workspaces
  getPublicWorkspaces: async () => {
    try {
      const response = await api.get("/workspaces/public");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create workspace
  createWorkspace: async (data) => {
    try {
      const response = await api.post("/workspaces", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user workspaces
  getUserWorkspaces: async () => {
    try {
      const response = await api.get("/workspaces");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get workspace by ID
  getWorkspaceById: async (id) => {
    try {
      const response = await api.get(`/workspaces/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update workspace
  updateWorkspace: async (id, data) => {
    try {
      const response = await api.put(`/workspaces/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete workspace
  deleteWorkspace: async (id) => {
    try {
      const response = await api.delete(`/workspaces/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add member to workspace
  addMember: async (workspaceId, data) => {
    try {
      const response = await api.post(
        `/workspaces/${workspaceId}/members`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove member from workspace
  removeMember: async (workspaceId, userId) => {
    try {
      const response = await api.delete(
        `/workspaces/${workspaceId}/members/${userId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update member role
  updateMemberRole: async (workspaceId, userId, data) => {
    try {
      const response = await api.put(
        `/workspaces/${workspaceId}/members/${userId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
