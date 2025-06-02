import { create } from "zustand";
import { workspaceAPI } from "../redux/api/workspaceAPI";

const useWorkspaceStore = create((set, get) => ({
  // State
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setCreateLoading: (loading) => set({ createLoading: loading }),
  setUpdateLoading: (loading) => set({ updateLoading: loading }),
  setDeleteLoading: (loading) => set({ deleteLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  resetWorkspaceState: () =>
    set({
      workspaces: [],
      currentWorkspace: null,
      loading: false,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      error: null,
    }),

  // Async Actions
  fetchUserWorkspaces: async () => {
    set({ loading: true, error: null });

    try {
      console.log("API: Fetching user workspaces...");
      const response = await workspaceAPI.getUserWorkspaces();
      console.log(
        "API: Workspaces fetched successfully:",
        response.data.length
      );

      set({
        loading: false,
        workspaces: response.data,
        error: null,
      });

      return response.data;
    } catch (error) {
      console.error("API: Failed to fetch workspaces:", error);
      const errorMessage = error.message || "Failed to fetch workspaces";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  fetchWorkspaceById: async (workspaceId) => {
    set({ loading: true, error: null });

    try {
      const response = await workspaceAPI.getWorkspaceById(workspaceId);

      set({
        loading: false,
        currentWorkspace: response.data,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch workspace";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  createWorkspace: async (workspaceData) => {
    set({ createLoading: true, error: null });

    try {
      const response = await workspaceAPI.createWorkspace(workspaceData);
      const newWorkspace = response.data;

      set((state) => ({
        createLoading: false,
        workspaces: [...state.workspaces, newWorkspace],
        error: null,
      }));

      return newWorkspace;
    } catch (error) {
      const errorMessage = error.message || "Failed to create workspace";

      set({
        createLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  updateWorkspace: async (workspaceId, workspaceData) => {
    set({ updateLoading: true, error: null });

    try {
      const response = await workspaceAPI.updateWorkspace(
        workspaceId,
        workspaceData
      );
      const updatedWorkspace = response.data;

      set((state) => ({
        updateLoading: false,
        workspaces: state.workspaces.map((workspace) =>
          workspace._id === workspaceId ? updatedWorkspace : workspace
        ),
        currentWorkspace:
          state.currentWorkspace?._id === workspaceId
            ? updatedWorkspace
            : state.currentWorkspace,
        error: null,
      }));

      return updatedWorkspace;
    } catch (error) {
      const errorMessage = error.message || "Failed to update workspace";

      set({
        updateLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  deleteWorkspace: async (workspaceId) => {
    set({ deleteLoading: true, error: null });

    try {
      await workspaceAPI.deleteWorkspace(workspaceId);

      set((state) => ({
        deleteLoading: false,
        workspaces: state.workspaces.filter(
          (workspace) => workspace._id !== workspaceId
        ),
        currentWorkspace:
          state.currentWorkspace?._id === workspaceId
            ? null
            : state.currentWorkspace,
        error: null,
      }));

      return workspaceId;
    } catch (error) {
      const errorMessage = error.message || "Failed to delete workspace";

      set({
        deleteLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  addMember: async (workspaceId, memberData) => {
    try {
      const response = await workspaceAPI.addMember(workspaceId, memberData);
      const responseData = response.data;

      // Check if it's a workspace update (existing user) or invitation (new user)
      if (responseData.workspace) {
        // Existing user was added - update workspace members
        const updatedWorkspace = responseData.workspace;

        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace._id === workspaceId ? updatedWorkspace : workspace
          ),
          currentWorkspace:
            state.currentWorkspace?._id === workspaceId
              ? updatedWorkspace
              : state.currentWorkspace,
        }));

        return response;
      } else if (responseData.invitation) {
        // New user - invitation was sent, no immediate workspace update needed
        return response;
      }

      // Fallback - shouldn't reach here normally
      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to add member";
      throw error;
    }
  },

  removeMember: async (workspaceId, memberId) => {
    try {
      await workspaceAPI.removeMember(workspaceId, memberId);

      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace._id === workspaceId
            ? {
                ...workspace,
                members: workspace.members.filter((m) => m._id !== memberId),
              }
            : workspace
        ),
        currentWorkspace:
          state.currentWorkspace?._id === workspaceId
            ? {
                ...state.currentWorkspace,
                members: state.currentWorkspace.members.filter(
                  (m) => m._id !== memberId
                ),
              }
            : state.currentWorkspace,
      }));

      return { workspaceId, memberId };
    } catch (error) {
      const errorMessage = error.message || "Failed to remove member";
      throw error;
    }
  },

  updateMemberRole: async (workspaceId, memberId, role) => {
    try {
      const response = await workspaceAPI.updateMemberRole(
        workspaceId,
        memberId,
        { role }
      );

      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace._id === workspaceId
            ? {
                ...workspace,
                members: workspace.members.map((m) =>
                  m._id === memberId ? { ...m, role } : m
                ),
              }
            : workspace
        ),
        currentWorkspace:
          state.currentWorkspace?._id === workspaceId
            ? {
                ...state.currentWorkspace,
                members: state.currentWorkspace.members.map((m) =>
                  m._id === memberId ? { ...m, role } : m
                ),
              }
            : state.currentWorkspace,
      }));

      return { workspaceId, memberId, role };
    } catch (error) {
      const errorMessage = error.message || "Failed to update member role";
      throw error;
    }
  },
}));

export default useWorkspaceStore;
