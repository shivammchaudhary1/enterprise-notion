import { createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceAPI } from "../api/workspaceAPI";
import {
  setLoading,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
  setError,
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  removeWorkspace,
  addMemberToWorkspace,
  removeMemberFromWorkspace,
  updateMemberRole,
} from "../slices/workspaceSlice";

// Fetch user workspaces
export const fetchUserWorkspaces = createAsyncThunk(
  "workspace/fetchUserWorkspaces",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("API: Fetching user workspaces...");
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await workspaceAPI.getUserWorkspaces();
      console.log(
        "API: Workspaces fetched successfully:",
        response.data.length
      );
      dispatch(setWorkspaces(response.data));

      return response.data;
    } catch (error) {
      console.error("API: Failed to fetch workspaces:", error);
      const errorMessage = error.message || "Failed to fetch workspaces";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// ...existing code...

// Add the missing fetchWorkspacesAction
export const fetchWorkspacesAction = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await workspaceAPI.getUserWorkspaces();
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch workspaces";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// ...existing code...

// Fetch workspace by ID
export const fetchWorkspaceById = createAsyncThunk(
  "workspace/fetchWorkspaceById",
  async (workspaceId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await workspaceAPI.getWorkspaceById(workspaceId);
      dispatch(setCurrentWorkspace(response.data));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch workspace";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Create workspace
export const createWorkspaceAction = createAsyncThunk(
  "workspace/createWorkspace",
  async (workspaceData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setCreateLoading(true));
      dispatch(setError(null));

      const response = await workspaceAPI.createWorkspace(workspaceData);
      dispatch(addWorkspace(response.data));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to create workspace";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setCreateLoading(false));
    }
  }
);

// Update workspace
export const updateWorkspaceAction = createAsyncThunk(
  "workspace/updateWorkspace",
  async ({ workspaceId, workspaceData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUpdateLoading(true));
      dispatch(setError(null));

      const response = await workspaceAPI.updateWorkspace(
        workspaceId,
        workspaceData
      );
      dispatch(updateWorkspace(response.data));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to update workspace";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setUpdateLoading(false));
    }
  }
);

// Delete workspace
export const deleteWorkspaceAction = createAsyncThunk(
  "workspace/deleteWorkspace",
  async (workspaceId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setDeleteLoading(true));
      dispatch(setError(null));

      await workspaceAPI.deleteWorkspace(workspaceId);
      dispatch(removeWorkspace(workspaceId));

      return workspaceId;
    } catch (error) {
      const errorMessage = error.message || "Failed to delete workspace";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setDeleteLoading(false));
    }
  }
);

// Add member to workspace
export const addMemberAction = createAsyncThunk(
  "workspace/addMember",
  async ({ workspaceId, memberData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      const response = await workspaceAPI.addMember(workspaceId, memberData);
      dispatch(addMemberToWorkspace({ workspaceId, member: response.data }));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to add member";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove member from workspace
export const removeMemberAction = createAsyncThunk(
  "workspace/removeMember",
  async ({ workspaceId, memberId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      await workspaceAPI.removeMember(workspaceId, memberId);
      dispatch(removeMemberFromWorkspace({ workspaceId, memberId }));

      return { workspaceId, memberId };
    } catch (error) {
      const errorMessage = error.message || "Failed to remove member";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Update member role
export const updateMemberRoleAction = createAsyncThunk(
  "workspace/updateMemberRole",
  async ({ workspaceId, memberId, role }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      const response = await workspaceAPI.updateMemberRole(
        workspaceId,
        memberId,
        { role }
      );
      dispatch(updateMemberRole({ workspaceId, memberId, role }));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to update member role";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);
