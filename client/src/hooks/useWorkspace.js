import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchUserWorkspaces,
  fetchWorkspaceById,
  createWorkspaceAction,
  updateWorkspaceAction,
  deleteWorkspaceAction,
  addMemberAction,
  removeMemberAction,
  updateMemberRoleAction,
} from "../redux/actions/workspaceActions";
import {
  setCurrentWorkspace,
  clearError,
} from "../redux/slices/workspaceSlice";

export const useWorkspace = () => {
  const dispatch = useDispatch();
  const {
    workspaces,
    currentWorkspace,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
    error,
  } = useSelector((state) => state.workspace);

  // Fetch user workspaces
  const loadUserWorkspaces = useCallback(() => {
    return dispatch(fetchUserWorkspaces());
  }, [dispatch]);

  // Fetch workspace by ID
  const loadWorkspaceById = useCallback(
    (workspaceId) => {
      return dispatch(fetchWorkspaceById(workspaceId));
    },
    [dispatch]
  );

  // Create workspace
  const createWorkspace = useCallback(
    (workspaceData) => {
      return dispatch(createWorkspaceAction(workspaceData));
    },
    [dispatch]
  );

  // Update workspace
  const updateWorkspace = useCallback(
    (workspaceId, workspaceData) => {
      return dispatch(updateWorkspaceAction({ workspaceId, workspaceData }));
    },
    [dispatch]
  );

  // Delete workspace
  const deleteWorkspace = useCallback(
    (workspaceId) => {
      return dispatch(deleteWorkspaceAction(workspaceId));
    },
    [dispatch]
  );

  // Add member
  const addMember = useCallback(
    (workspaceId, memberData) => {
      return dispatch(addMemberAction({ workspaceId, memberData }));
    },
    [dispatch]
  );

  // Remove member
  const removeMember = useCallback(
    (workspaceId, memberId) => {
      return dispatch(removeMemberAction({ workspaceId, memberId }));
    },
    [dispatch]
  );

  // Update member role
  const updateMemberRole = useCallback(
    (workspaceId, memberId, role) => {
      return dispatch(updateMemberRoleAction({ workspaceId, memberId, role }));
    },
    [dispatch]
  );

  // Set current workspace
  const setActiveWorkspace = useCallback(
    (workspace) => {
      dispatch(setCurrentWorkspace(workspace));
    },
    [dispatch]
  );

  // Clear error
  const clearWorkspaceError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper functions
  const getUserRole = useCallback((workspace, userId) => {
    if (!workspace || !workspace.members) return null;
    const member = workspace.members.find(
      (m) => m.user._id === userId || m.user === userId
    );
    return member ? member.role : null;
  }, []);

  const canEditWorkspace = useCallback(
    (workspace, userId) => {
      const role = getUserRole(workspace, userId);
      return ["owner", "admin", "editor"].includes(role);
    },
    [getUserRole]
  );

  const canAdminWorkspace = useCallback(
    (workspace, userId) => {
      const role = getUserRole(workspace, userId);
      return ["owner", "admin"].includes(role);
    },
    [getUserRole]
  );

  const isWorkspaceOwner = useCallback((workspace, userId) => {
    return workspace?.owner === userId || workspace?.owner?._id === userId;
  }, []);

  return {
    // State
    workspaces,
    currentWorkspace,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
    error,

    // Actions
    loadUserWorkspaces,
    loadWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addMember,
    removeMember,
    updateMemberRole,
    setActiveWorkspace,
    clearWorkspaceError,

    // Helper functions
    getUserRole,
    canEditWorkspace,
    canAdminWorkspace,
    isWorkspaceOwner,
  };
};
