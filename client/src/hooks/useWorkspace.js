import { useEffect, useRef } from "react";
import { useWorkspaceStore, useAuthStore } from "../stores";

export const useWorkspace = () => {
  const {
    workspaces,
    currentWorkspace,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
    error,
    fetchUserWorkspaces,
    fetchWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addMember,
    removeMember,
    updateMemberRole,
    setCurrentWorkspace,
    clearError,
  } = useWorkspaceStore();

  const { user } = useAuthStore();
  const fetchedRef = useRef(false);

  // Load user workspaces on mount (only once)
  useEffect(() => {
    if (!fetchedRef.current && user?.id) {
      fetchedRef.current = true;
      fetchUserWorkspaces();
    }
  }, [fetchUserWorkspaces, user?.id]);

  const loadUserWorkspaces = () => {
    fetchedRef.current = true;
    return fetchUserWorkspaces();
  };

  const setActiveWorkspace = async (workspace) => {
    try {
      // Validate workspace object
      if (!workspace || !workspace._id) {
        throw new Error("Invalid workspace");
      }

      // Verify workspace exists in the list
      const workspaceExists = workspaces.some((w) => w._id === workspace._id);
      if (!workspaceExists) {
        throw new Error("Workspace not found in available workspaces");
      }

      // Set the current workspace
      setCurrentWorkspace(workspace);

      return workspace;
    } catch (error) {
      console.error("Error setting active workspace:", error);
      throw error;
    }
  };

  const clearWorkspaceError = () => {
    clearError();
  };

  return {
    workspaces,
    currentWorkspace,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
    error,
    loadUserWorkspaces,
    fetchWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addMember,
    removeMember,
    updateMemberRole,
    setActiveWorkspace,
    clearWorkspaceError,
  };
};
