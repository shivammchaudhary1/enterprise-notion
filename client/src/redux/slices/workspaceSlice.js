import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserWorkspaces,
  fetchWorkspaceById,
  createWorkspaceAction,
  updateWorkspaceAction,
  deleteWorkspaceAction,
  addMemberAction,
  removeMemberAction,
  updateMemberRoleAction,
} from "../actions/workspaceActions";

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCreateLoading: (state, action) => {
      state.createLoading = action.payload;
    },
    setUpdateLoading: (state, action) => {
      state.updateLoading = action.payload;
    },
    setDeleteLoading: (state, action) => {
      state.deleteLoading = action.payload;
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Workspace CRUD operations
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },

    // Reset state
    resetWorkspaceState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user workspaces
      .addCase(fetchUserWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
        state.error = null;
      })
      .addCase(fetchUserWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch workspace by ID
      .addCase(fetchWorkspaceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkspace = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkspaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create workspace
      .addCase(createWorkspaceAction.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createWorkspaceAction.fulfilled, (state, action) => {
        state.createLoading = false;
        state.workspaces.push(action.payload);
        state.error = null;
      })
      .addCase(createWorkspaceAction.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // Update workspace
      .addCase(updateWorkspaceAction.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateWorkspaceAction.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.workspaces.findIndex(
          (workspace) => workspace._id === action.payload._id
        );
        if (index !== -1) {
          state.workspaces[index] = action.payload;
        }
        if (state.currentWorkspace?._id === action.payload._id) {
          state.currentWorkspace = action.payload;
        }
        state.error = null;
      })
      .addCase(updateWorkspaceAction.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Delete workspace
      .addCase(deleteWorkspaceAction.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteWorkspaceAction.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.workspaces = state.workspaces.filter(
          (workspace) => workspace._id !== action.payload
        );
        if (state.currentWorkspace?._id === action.payload) {
          state.currentWorkspace = null;
        }
        state.error = null;
      })
      .addCase(deleteWorkspaceAction.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // Add member
      .addCase(addMemberAction.fulfilled, (state, action) => {
        const { workspaceId, member } = action.payload;
        const workspace = state.workspaces.find((w) => w._id === workspaceId);
        if (workspace) {
          workspace.members.push(member);
        }
        if (state.currentWorkspace?._id === workspaceId) {
          state.currentWorkspace.members.push(member);
        }
      })

      // Remove member
      .addCase(removeMemberAction.fulfilled, (state, action) => {
        const { workspaceId, memberId } = action.payload;
        const workspace = state.workspaces.find((w) => w._id === workspaceId);
        if (workspace) {
          workspace.members = workspace.members.filter(
            (m) => m._id !== memberId
          );
        }
        if (state.currentWorkspace?._id === workspaceId) {
          state.currentWorkspace.members =
            state.currentWorkspace.members.filter((m) => m._id !== memberId);
        }
      })

      // Update member role
      .addCase(updateMemberRoleAction.fulfilled, (state, action) => {
        const { workspaceId, memberId, role } = action.payload;
        const workspace = state.workspaces.find((w) => w._id === workspaceId);
        if (workspace) {
          const member = workspace.members.find((m) => m._id === memberId);
          if (member) {
            member.role = role;
          }
        }
        if (state.currentWorkspace?._id === workspaceId) {
          const member = state.currentWorkspace.members.find(
            (m) => m._id === memberId
          );
          if (member) {
            member.role = role;
          }
        }
      });
  },
});

export const {
  setLoading,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
  setError,
  clearError,
  setWorkspaces,
  setCurrentWorkspace,
  resetWorkspaceState,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
