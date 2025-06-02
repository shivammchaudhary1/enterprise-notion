import Workspace from "../models/workspace.model.js";
import Document from "../models/document.model.js";
import Invitation from "../models/invitation.model.js";
import { errorMessage, successMessage } from "../utils/response.js";
import { sendWorkspaceInvitationEmail } from "../config/libraries/nodeMailer.js";
import { generateInvitationToken } from "./invitation.controller.js";

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

    // Disable caching headers
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Expires", "-1");
    res.set("Pragma", "no-cache");

    const workspaces = await Workspace.find({
      "members.user": userId,
      isDeleted: false,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: workspaces,
      message: "Workspaces retrieved successfully",
    });
  } catch (error) {
    console.error("Get workspaces error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve workspaces",
    });
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

// Add member to workspace (handles both existing users and email invitations)
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

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if there's already a pending invitation for this email
    const existingInvitation = await Invitation.findPendingByEmailAndWorkspace(
      normalizedEmail,
      workspaceId
    );

    if (existingInvitation) {
      return res
        .status(400)
        .json(
          errorMessage(
            "An invitation has already been sent to this email address"
          )
        );
    }

    // Find user by email
    const User = (await import("../models/user.model.js")).default;
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      // User exists - add them directly to workspace

      // Check if user is already a member
      if (workspace.isMember(existingUser._id)) {
        return res.status(400).json(errorMessage("User is already a member"));
      }

      // Add member directly
      workspace.members.push({
        user: existingUser._id,
        role,
      });

      await workspace.save();

      // Populate details
      await workspace.populate("owner", "name email");
      await workspace.populate("members.user", "name email");

      return res.status(200).json(
        successMessage("Member added successfully", {
          workspace,
          message: `${existingUser.name} has been added to the workspace`,
        })
      );
    } else {
      // User doesn't exist - create invitation and send email

      // Get inviter details
      const inviter = await User.findById(userId);
      if (!inviter) {
        return res.status(404).json(errorMessage("Inviter not found"));
      }

      // Create invitation
      const invitationToken = generateInvitationToken();
      const invitation = new Invitation({
        email: normalizedEmail,
        workspace: workspaceId,
        invitedBy: userId,
        role,
        token: invitationToken,
      });

      await invitation.save();

      // Send invitation email (don't wait for it to complete)
      sendWorkspaceInvitationEmail(
        normalizedEmail,
        workspace.name,
        inviter.name,
        role,
        invitationToken
      ).catch((error) => {
        console.error("Failed to send invitation email:", error);
        // Update invitation status if email fails
        invitation.status = "cancelled";
        invitation.save();
      });

      // Populate invitation details for response
      await invitation.populate("workspace", "name emoji");
      await invitation.populate("invitedBy", "name email");

      return res.status(200).json(
        successMessage("Invitation sent successfully", {
          invitation,
          message: `An invitation has been sent to ${normalizedEmail}`,
        })
      );
    }
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
