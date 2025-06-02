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

  const setActiveWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
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
