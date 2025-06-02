import crypto from "crypto";
import Invitation from "../models/invitation.model.js";
import Workspace from "../models/workspace.model.js";
import User from "../models/user.model.js";
import { hashPassword } from "../config/libraries/bcrypt.js";
import {
  sendWorkspaceInvitationEmail,
  sendAccountCredentialsEmail,
} from "../config/libraries/nodeMailer.js";
import { errorMessage, successMessage } from "../utils/response.js";

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} - Generated password
 */
const generateSecurePassword = (length = 12) => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = lowercase + uppercase + numbers + symbols;
  let password = "";

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

/**
 * Get invitation details by token
 */
export const getInvitationByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findValidByToken(token);

    if (!invitation) {
      return res
        .status(404)
        .json(errorMessage("Invitation not found or has expired"));
    }

    return res.status(200).json(
      successMessage("Invitation retrieved successfully", {
        invitation: {
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          workspace: invitation.workspace,
          invitedBy: invitation.invitedBy,
          createdAt: invitation.createdAt,
          expiresAt: invitation.expiresAt,
        },
      })
    );
  } catch (error) {
    console.error("Get invitation error:", error);
    return res.status(500).json(errorMessage("Failed to retrieve invitation"));
  }
};

/**
 * Accept workspace invitation - handles both existing users and creates new accounts
 */
export const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const authenticatedUserId = req.user?.userId; // May be undefined for non-authenticated users

    // Find the invitation by token
    const invitation = await Invitation.findValidByToken(token);

    if (!invitation) {
      return res
        .status(404)
        .json(errorMessage("Invitation not found or has expired"));
    }

    // Get workspace
    const workspace = await Workspace.findOne({
      _id: invitation.workspace,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    // Check if user with invitation email already exists
    let targetUser = await User.findOne({
      email: invitation.email.toLowerCase(),
    });
    let isNewUser = false;
    let generatedPassword = null;

    if (!targetUser) {
      // User doesn't exist - create a new account
      isNewUser = true;
      generatedPassword = generateSecurePassword(12);

      // Extract name from email (part before @)
      const nameFromEmail = invitation.email.split("@")[0];
      const displayName =
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

      // Hash the generated password
      const hashedPassword = await hashPassword(generatedPassword);

      // Create new user
      targetUser = new User({
        name: displayName,
        email: invitation.email.toLowerCase(),
        password: hashedPassword,
      });

      await targetUser.save();

      // Send credentials email to the new user
      try {
        await sendAccountCredentialsEmail(
          targetUser.email,
          targetUser.name,
          generatedPassword,
          workspace.name
        );
      } catch (emailError) {
        console.error("Failed to send credentials email:", emailError);
        // Don't fail the entire process if email fails
      }
    } else {
      // User exists - check if authenticated user matches
      if (
        authenticatedUserId &&
        authenticatedUserId !== targetUser._id.toString()
      ) {
        return res
          .status(400)
          .json(
            errorMessage(
              "This invitation was sent to a different email address"
            )
          );
      }
    }

    // Check if user is already a member of the workspace
    if (workspace.isMember(targetUser._id)) {
      // Accept invitation anyway to mark it as used
      await invitation.accept(targetUser._id);

      if (isNewUser) {
        return res.status(200).json(
          successMessage("Account created successfully", {
            message: `Your account has been created and you're already a member of ${workspace.name}. Please check your email for login credentials.`,
            action: "redirect_to_login",
            isNewUser: true,
          })
        );
      } else {
        return res.status(200).json(
          successMessage("Already a member", {
            message: `You are already a member of ${workspace.name}`,
            action: "redirect_to_workspace",
            workspace: { _id: workspace._id, name: workspace.name },
          })
        );
      }
    }

    // Add user to workspace
    workspace.members.push({
      user: targetUser._id,
      role: invitation.role,
    });

    await workspace.save();

    // Accept the invitation
    await invitation.accept(targetUser._id);

    // Populate workspace details for response
    await workspace.populate("owner", "name email");
    await workspace.populate("members.user", "name email");

    if (isNewUser) {
      return res.status(200).json(
        successMessage("Account created and invitation accepted", {
          message: `Your account has been created and you've been added to ${workspace.name} as a ${invitation.role}. Please check your email for login credentials.`,
          action: "redirect_to_login",
          isNewUser: true,
        })
      );
    } else {
      return res.status(200).json(
        successMessage("Invitation accepted successfully", {
          workspace,
          message: `Welcome to ${workspace.name}! You've been added as a ${invitation.role}.`,
          action: "redirect_to_workspace",
        })
      );
    }
  } catch (error) {
    console.error("Accept invitation error:", error);
    return res.status(500).json(errorMessage("Failed to accept invitation"));
  }
};

/**
 * Get pending invitations for a workspace
 */
export const getWorkspaceInvitations = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    // Check if workspace exists and user can admin
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    if (!workspace.canAdmin(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Get pending invitations
    const invitations = await Invitation.findPendingForWorkspace(workspaceId);

    return res.status(200).json(
      successMessage("Invitations retrieved successfully", {
        invitations,
      })
    );
  } catch (error) {
    console.error("Get workspace invitations error:", error);
    return res.status(500).json(errorMessage("Failed to retrieve invitations"));
  }
};

/**
 * Cancel/revoke an invitation
 */
export const cancelInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.userId;

    const invitation = await Invitation.findById(invitationId).populate(
      "workspace"
    );

    if (!invitation) {
      return res.status(404).json(errorMessage("Invitation not found"));
    }

    // Check if user can admin the workspace
    if (!invitation.workspace.canAdmin(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Cancel the invitation
    await invitation.cancel();

    return res.status(200).json(
      successMessage("Invitation cancelled successfully", {
        invitation,
      })
    );
  } catch (error) {
    console.error("Cancel invitation error:", error);
    return res.status(500).json(errorMessage("Failed to cancel invitation"));
  }
};

/**
 * Resend invitation email
 */
export const resendInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.userId;

    const invitation = await Invitation.findById(invitationId)
      .populate("workspace", "name")
      .populate("invitedBy", "name");

    if (!invitation) {
      return res.status(404).json(errorMessage("Invitation not found"));
    }

    if (!invitation.canAccept()) {
      return res
        .status(400)
        .json(errorMessage("Invitation has expired or is no longer valid"));
    }

    // Check if user can admin the workspace
    const workspace = await Workspace.findById(invitation.workspace._id);
    if (!workspace.canAdmin(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Send invitation email
    try {
      await sendWorkspaceInvitationEmail(
        invitation.email,
        invitation.workspace.name,
        invitation.invitedBy.name,
        invitation.role,
        invitation.token
      );

      return res.status(200).json(
        successMessage("Invitation email sent successfully", {
          invitation,
        })
      );
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
      return res
        .status(500)
        .json(errorMessage("Failed to send invitation email"));
    }
  } catch (error) {
    console.error("Resend invitation error:", error);
    return res.status(500).json(errorMessage("Failed to resend invitation"));
  }
};

/**
 * Generate invitation token
 */
export const generateInvitationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export default {
  getInvitationByToken,
  acceptInvitation,
  getWorkspaceInvitations,
  cancelInvitation,
  resendInvitation,
  generateInvitationToken,
};
