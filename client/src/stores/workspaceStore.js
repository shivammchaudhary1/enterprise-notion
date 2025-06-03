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
  setCurrentWorkspace: (workspace) => {
    return new Promise((resolve, reject) => {
      try {
        console.log("Setting current workspace:", workspace?.name);

        if (!workspace || !workspace._id) {
          const error = new Error(
            "Invalid workspace provided to setCurrentWorkspace"
          );
          console.error(error.message, workspace);
          reject(error);
          return;
        }

        set((state) => {
          // Verify the workspace exists in our list
          const workspaceExists = state.workspaces.some(
            (w) => w._id === workspace._id
          );
          if (!workspaceExists) {
            const error = new Error(
              "Workspace not found in available workspaces"
            );
            console.error(error.message, {
              workspaceId: workspace._id,
              availableWorkspaces: state.workspaces.map((w) => ({
                id: w._id,
                name: w.name,
              })),
            });
            reject(error);
            return state;
          }

          console.log(
            "Successfully updated current workspace to:",
            workspace.name
          );
          const newState = {
            ...state,
            currentWorkspace: workspace,
            error: null,
          };
          resolve(workspace);
          return newState;
        });
      } catch (error) {
        console.error("Error in setCurrentWorkspace:", {
          error,
          workspace,
          errorMessage: error.message,
          stack: error.stack,
        });
        set({ error: error.message });
        reject(error);
      }
    });
  },
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
    console.log("Fetching user workspaces...");

    try {
      const response = await workspaceAPI.getUserWorkspaces();
      console.log("Workspaces fetched successfully:", {
        count: response.data.length,
        workspaces: response.data.map((w) => ({ id: w._id, name: w.name })),
      });

      set({
        loading: false,
        workspaces: response.data,
        error: null,
      });

      // If there are workspaces but no current workspace selected, select the first one
      const state = get();
      if (response.data.length > 0 && !state.currentWorkspace) {
        console.log("Setting initial workspace to:", response.data[0].name);
        set({ currentWorkspace: response.data[0] });
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch workspaces:", {
        error,
        errorMessage: error.message,
        stack: error.stack,
      });

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
      const newWorkspace = response.data.workspace;

      set((state) => ({
        createLoading: false,
        workspaces: [...state.workspaces, newWorkspace],
        currentWorkspace: newWorkspace,
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
