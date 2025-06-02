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

  // ... existing code ...
};
