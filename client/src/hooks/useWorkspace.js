import { useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const { user } = useSelector((state) => state.auth);

  // Use ref to track if workspaces have been fetched
  const hasFetchedWorkspaces = useRef(false);

  // Fetch workspaces only once when component mounts and user is available
  useEffect(() => {
    console.log("useWorkspace effect triggered:", {
      hasUser: !!user,
      userId: user?.id,
      hasFetched: hasFetchedWorkspaces.current,
      loading,
      workspacesLength: workspaces.length,
    });

    if (
      user &&
      user.id &&
      !hasFetchedWorkspaces.current &&
      !loading &&
      workspaces.length === 0
    ) {
      console.log("Fetching workspaces...");
      hasFetchedWorkspaces.current = true;
      dispatch(fetchUserWorkspaces());
    }
  }, [dispatch, user?.id, loading]); // Include loading to prevent race conditions

  // Reset fetch flag when user changes
  useEffect(() => {
    if (!user || !user.id) {
      hasFetchedWorkspaces.current = false;
    }
  }, [user?.id]);

  // Fetch user workspaces
  const loadUserWorkspaces = useCallback(() => {
    // Prevent multiple simultaneous calls
    if (loading || hasFetchedWorkspaces.current) {
      return Promise.resolve();
    }
    hasFetchedWorkspaces.current = true;
    return dispatch(fetchUserWorkspaces());
  }, [dispatch, loading]);

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

  // Refresh workspaces
  const refreshWorkspaces = useCallback(() => {
    if (user && user.id) {
      hasFetchedWorkspaces.current = true;
      dispatch(fetchUserWorkspaces());
    }
  }, [dispatch, user?.id]);

  // Helper functions - these don't need to be in useCallback since they don't depend on state
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

  // Memoized return object with stable references
  return useMemo(
    () => ({
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
      refreshWorkspaces,

      // Helper functions
      getUserRole,
      canEditWorkspace,
      canAdminWorkspace,
      isWorkspaceOwner,
    }),
    [
      workspaces,
      currentWorkspace,
      loading,
      createLoading,
      updateLoading,
      deleteLoading,
      error,
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
      refreshWorkspaces,
      getUserRole,
      canEditWorkspace,
      canAdminWorkspace,
      isWorkspaceOwner,
    ]
  );
};
