import Workspace from "../models/workspace.model.js";
import Document from "../models/document.model.js";
import { errorMessage, successMessage } from "../utils/response.js";

// Create workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, description, emoji, settings } = req.body;
    const userId = req.user.userId;

    const workspace = new Workspace({
      name,
      description,
      emoji: emoji || "🏠",
      owner: userId,
      settings: {
        isPublic: settings?.isPublic || false,
        allowMemberInvites: settings?.allowMemberInvites !== false,
        defaultPermission: settings?.defaultPermission || "viewer",
      },
    });

    await workspace.save();

    // Populate owner details
    await workspace.populate("owner", "name email");
    await workspace.populate("members.user", "name email");

    return res.status(201).json(
      successMessage("Workspace created successfully", {
        workspace,
      })
    );
  } catch (error) {
    console.error("Create workspace error:", error);
    return res.status(500).json(errorMessage("Failed to create workspace"));
  }
};

// Get user workspaces
export const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user.userId;

    const workspaces = await Workspace.find({
      "members.user": userId,
      isDeleted: false,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort({ updatedAt: -1 });

    return res.status(200).json(
      successMessage("Workspaces retrieved successfully", {
        workspaces,
      })
    );
  } catch (error) {
    console.error("Get workspaces error:", error);
    return res.status(500).json(errorMessage("Failed to retrieve workspaces"));
  }
};

// Get workspace by ID
export const getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    // Check if user is a member
    if (!workspace.isMember(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    return res.status(200).json(
      successMessage("Workspace retrieved successfully", {
        workspace,
      })
    );
  } catch (error) {
    console.error("Get workspace error:", error);
    return res.status(500).json(errorMessage("Failed to retrieve workspace"));
  }
};

// Update workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description, emoji, settings } = req.body;
    const userId = req.user.userId;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    // Check if user can admin
    if (!workspace.canAdmin(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Update fields
    if (name !== undefined) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (emoji !== undefined) workspace.emoji = emoji;
    if (settings) {
      workspace.settings = { ...workspace.settings, ...settings };
    }

    await workspace.save();

    // Populate details
    await workspace.populate("owner", "name email");
    await workspace.populate("members.user", "name email");

    return res.status(200).json(
      successMessage("Workspace updated successfully", {
        workspace,
      })
    );
  } catch (error) {
    console.error("Update workspace error:", error);
    return res.status(500).json(errorMessage("Failed to update workspace"));
  }
};

// Delete workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    // Only owner can delete workspace
    if (workspace.owner.toString() !== userId) {
      return res
        .status(403)
        .json(errorMessage("Only owner can delete workspace"));
    }

    // Soft delete workspace
    workspace.isDeleted = true;
    workspace.deletedAt = new Date();
    await workspace.save();

    // Also soft delete all documents in the workspace
    await Document.updateMany(
      { workspace: workspaceId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() }
    );

    return res
      .status(200)
      .json(successMessage("Workspace deleted successfully"));
  } catch (error) {
    console.error("Delete workspace error:", error);
    return res.status(500).json(errorMessage("Failed to delete workspace"));
  }
};

// Add member to workspace
export const addMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role = "viewer" } = req.body;
    const userId = req.user.userId;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    // Check if user can admin
    if (!workspace.canAdmin(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Find user by email
    const User = (await import("../models/user.model.js")).default;
    const newMember = await User.findOne({ email });

    if (!newMember) {
      return res.status(404).json(errorMessage("User not found"));
    }

    // Check if user is already a member
    if (workspace.isMember(newMember._id)) {
      return res.status(400).json(errorMessage("User is already a member"));
    }

    // Add member
    workspace.members.push({
      user: newMember._id,
      role,
    });

    await workspace.save();

    // Populate details
    await workspace.populate("owner", "name email");
    await workspace.populate("members.user", "name email");

    return res.status(200).json(
      successMessage("Member added successfully", {
        workspace,
      })
    );
  } catch (error) {
    console.error("Add member error:", error);
    return res.status(500).json(errorMessage("Failed to add member"));
  }
};

// Remove member from workspace
export const removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const userId = req.user.userId;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    // Check if user can admin or if user is removing themselves
    if (!workspace.canAdmin(userId) && userId !== memberId) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Don't allow removing the owner
    if (workspace.owner.toString() === memberId) {
      return res
        .status(400)
        .json(errorMessage("Cannot remove workspace owner"));
    }

    // Remove member
    workspace.members = workspace.members.filter(
      (member) => member.user.toString() !== memberId
    );

    await workspace.save();

    // Populate details
    await workspace.populate("owner", "name email");
    await workspace.populate("members.user", "name email");

    return res.status(200).json(
      successMessage("Member removed successfully", {
        workspace,
      })
    );
  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json(errorMessage("Failed to remove member"));
  }
};

// Update member role
export const updateMemberRole = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;
    const userId = req.user.userId;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    // Check if user can admin
    if (!workspace.canAdmin(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Don't allow changing owner role
    if (workspace.owner.toString() === memberId) {
      return res.status(400).json(errorMessage("Cannot change owner role"));
    }

    // Find and update member role
    const member = workspace.members.find(
      (member) => member.user.toString() === memberId
    );

    if (!member) {
      return res.status(404).json(errorMessage("Member not found"));
    }

    member.role = role;
    await workspace.save();

    // Populate details
    await workspace.populate("owner", "name email");
    await workspace.populate("members.user", "name email");

    return res.status(200).json(
      successMessage("Member role updated successfully", {
        workspace,
      })
    );
  } catch (error) {
    console.error("Update member role error:", error);
    return res.status(500).json(errorMessage("Failed to update member role"));
  }
};
