import { createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceAPI } from "../api/workspaceAPI";

// Fetch user workspaces
export const fetchUserWorkspaces = createAsyncThunk(
  "workspace/fetchUserWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      console.log("API: Fetching user workspaces...");
      const response = await workspaceAPI.getUserWorkspaces();
      console.log(
        "API: Workspaces fetched successfully:",
        response.data.length
      );
      return response.data;
    } catch (error) {
      console.error("API: Failed to fetch workspaces:", error);
      const errorMessage = error.message || "Failed to fetch workspaces";
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove the duplicate fetchWorkspacesAction
// This was causing unnecessary rerenders by duplicating the same functionality

// Fetch workspace by ID
export const fetchWorkspaceById = createAsyncThunk(
  "workspace/fetchWorkspaceById",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await workspaceAPI.getWorkspaceById(workspaceId);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch workspace";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create workspace
export const createWorkspaceAction = createAsyncThunk(
  "workspace/createWorkspace",
  async (workspaceData, { rejectWithValue }) => {
    try {
      const response = await workspaceAPI.createWorkspace(workspaceData);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to create workspace";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update workspace
export const updateWorkspaceAction = createAsyncThunk(
  "workspace/updateWorkspace",
  async ({ workspaceId, workspaceData }, { rejectWithValue }) => {
    try {
      const response = await workspaceAPI.updateWorkspace(
        workspaceId,
        workspaceData
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to update workspace";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete workspace
export const deleteWorkspaceAction = createAsyncThunk(
  "workspace/deleteWorkspace",
  async (workspaceId, { rejectWithValue }) => {
    try {
      await workspaceAPI.deleteWorkspace(workspaceId);
      return workspaceId;
    } catch (error) {
      const errorMessage = error.message || "Failed to delete workspace";
      return rejectWithValue(errorMessage);
    }
  }
);

// Add member to workspace
export const addMemberAction = createAsyncThunk(
  "workspace/addMember",
  async ({ workspaceId, memberData }, { rejectWithValue }) => {
    try {
      const response = await workspaceAPI.addMember(workspaceId, memberData);
      return { workspaceId, member: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to add member";
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove member from workspace
export const removeMemberAction = createAsyncThunk(
  "workspace/removeMember",
  async ({ workspaceId, memberId }, { rejectWithValue }) => {
    try {
      await workspaceAPI.removeMember(workspaceId, memberId);
      return { workspaceId, memberId };
    } catch (error) {
      const errorMessage = error.message || "Failed to remove member";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update member role
export const updateMemberRoleAction = createAsyncThunk(
  "workspace/updateMemberRole",
  async ({ workspaceId, memberId, role }, { rejectWithValue }) => {
    try {
      const response = await workspaceAPI.updateMemberRole(
        workspaceId,
        memberId,
        { role }
      );
      return { workspaceId, memberId, role };
    } catch (error) {
      const errorMessage = error.message || "Failed to update member role";
      return rejectWithValue(errorMessage);
    }
  }
);
