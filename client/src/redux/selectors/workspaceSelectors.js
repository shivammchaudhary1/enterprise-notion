import { createSelector } from "@reduxjs/toolkit";

// Base selector
const selectWorkspaceState = (state) => state.workspace;

// Memoized selectors to prevent unnecessary rerenders
export const selectWorkspaces = createSelector(
  [selectWorkspaceState],
  (workspace) => workspace.workspaces
);

export const selectCurrentWorkspace = createSelector(
  [selectWorkspaceState],
  (workspace) => workspace.currentWorkspace
);

export const selectWorkspaceLoading = createSelector(
  [selectWorkspaceState],
  (workspace) => workspace.loading
);

export const selectWorkspaceCreateLoading = createSelector(
  [selectWorkspaceState],
  (workspace) => workspace.createLoading
);

export const selectWorkspaceUpdateLoading = createSelector(
  [selectWorkspaceState],
  (workspace) => workspace.updateLoading
);

export const selectWorkspaceDeleteLoading = createSelector(
  [selectWorkspaceState],
  (workspace) => workspace.deleteLoading
);

export const selectWorkspaceError = createSelector(
  [selectWorkspaceState],
  (workspace) => workspace.error
);

// Complex selectors
export const selectWorkspaceById = createSelector(
  [selectWorkspaces, (state, workspaceId) => workspaceId],
  (workspaces, workspaceId) =>
    workspaces.find((workspace) => workspace._id === workspaceId)
);

export const selectCurrentWorkspaceMembers = createSelector(
  [selectCurrentWorkspace],
  (currentWorkspace) => currentWorkspace?.members || []
);

export const selectWorkspaceCount = createSelector(
  [selectWorkspaces],
  (workspaces) => workspaces.length
);

// Check if user is workspace owner
export const selectIsWorkspaceOwner = createSelector(
  [selectCurrentWorkspace, (state, userId) => userId],
  (currentWorkspace, userId) =>
    currentWorkspace?.owner === userId ||
    currentWorkspace?.owner?._id === userId
);

// Check if user can admin workspace
export const selectCanAdminWorkspace = createSelector(
  [selectCurrentWorkspace, (state, userId) => userId],
  (currentWorkspace, userId) => {
    if (!currentWorkspace || !userId) return false;

    // Owner can always admin
    if (
      currentWorkspace.owner === userId ||
      currentWorkspace.owner?._id === userId
    ) {
      return true;
    }

    // Check if user is admin member
    const userMember = currentWorkspace.members?.find(
      (member) => member.user === userId || member.user?._id === userId
    );

    return userMember?.role === "admin";
  }
);
