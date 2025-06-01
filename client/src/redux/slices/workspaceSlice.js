import { createSlice } from "@reduxjs/toolkit";

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
    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload);
    },
    updateWorkspace: (state, action) => {
      const index = state.workspaces.findIndex(
        (workspace) => workspace._id === action.payload._id
      );
      if (index !== -1) {
        state.workspaces[index] = action.payload;
      }
      if (state.currentWorkspace?._id === action.payload._id) {
        state.currentWorkspace = action.payload;
      }
    },
    removeWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(
        (workspace) => workspace._id !== action.payload
      );
      if (state.currentWorkspace?._id === action.payload) {
        state.currentWorkspace = null;
      }
    },

    // Member management
    addMemberToWorkspace: (state, action) => {
      const { workspaceId, member } = action.payload;
      const workspace = state.workspaces.find((w) => w._id === workspaceId);
      if (workspace) {
        workspace.members.push(member);
      }
      if (state.currentWorkspace?._id === workspaceId) {
        state.currentWorkspace.members.push(member);
      }
    },
    removeMemberFromWorkspace: (state, action) => {
      const { workspaceId, memberId } = action.payload;
      const workspace = state.workspaces.find((w) => w._id === workspaceId);
      if (workspace) {
        workspace.members = workspace.members.filter((m) => m._id !== memberId);
      }
      if (state.currentWorkspace?._id === workspaceId) {
        state.currentWorkspace.members = state.currentWorkspace.members.filter(
          (m) => m._id !== memberId
        );
      }
    },
    updateMemberRole: (state, action) => {
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
    },

    // Reset state
    resetWorkspaceState: () => {
      return initialState;
    },
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
  addWorkspace,
  updateWorkspace,
  removeWorkspace,
  addMemberToWorkspace,
  removeMemberFromWorkspace,
  updateMemberRole,
  resetWorkspaceState,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
