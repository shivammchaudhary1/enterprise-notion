import User from "../models/user.model.js";
import Workspace from "../models/workspace.model.js";
import Document from "../models/document.model.js";
import crypto from "crypto";
import config from "../config/environment/default.js";
import { comparePassword } from "../config/libraries/bcrypt.js";
import { createJWT } from "../config/libraries/jwt.js";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../config/libraries/nodeMailer.js";

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    // Create default workspace for the user
    const defaultWorkspace = await Workspace.create({
      name: `${user.name}'s Workspace`,
      description:
        "Welcome to your personal workspace! Start organizing your documents and ideas here.",
      owner: user._id,
      emoji: "🏠",
      settings: {
        isPublic: false,
        allowMemberInvites: true,
        defaultPermission: "viewer",
      },
    });

    // Create default document in the workspace
    await Document.create({
      title: "Getting Started",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `Welcome to ${user.name}'s Workspace! 👋\n\nThis is your first document. Here are a few things you can do to get started:\n\n• Edit this document by clicking anywhere on the text\n• Create new documents using the + button in the sidebar\n• Organize documents by dragging them into folders\n• Customize your workspace settings\n\nHappy documenting! 🚀`,
              },
            ],
          },
        ],
      },
      emoji: "👋",
      workspace: defaultWorkspace._id,
      author: user._id,
      lastEditedBy: user._id,
    });

    // Create JWT token
    const token = createJWT({ userId: user._id });

    // Send welcome email (don't wait for it to complete, and skip in test environment)
    if (process.env.NODE_ENV !== "test") {
      sendWelcomeEmail(user.email, user.name).catch((error) => {
        console.error("Failed to send welcome email:", error);
        // Log the error but don't fail the registration
      });
    }

    // Send response (exclude password)
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      workspace: {
        id: defaultWorkspace._id,
        name: defaultWorkspace.name,
        description: defaultWorkspace.description,
        emoji: defaultWorkspace.emoji,
        role: "owner",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = [error.errors[key].message];
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "An error occurred while creating your account. Please try again.",
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field (normally excluded)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = createJWT({ userId: user._id });

    // Send response (exclude password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while signing in. Please try again.",
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user profile",
    });
  }
};

/**
 * Forgot password - send reset email
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send password reset email (don't wait for it to complete)
    sendPasswordResetEmail(user.email, resetToken, user.name).catch((error) => {
      console.error("Failed to send password reset email:", error);
    });

    res.status(200).json({
      success: true,
      message:
        "Password reset email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

/**
 * Reset password with token
 * @route POST /api/auth/reset-password/:token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token and find user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    // Set new password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Create JWT token for automatic login
    const jwtToken = createJWT({ userId: user._id });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting your password",
    });
  }
};

/**
 * Google OAuth callback handler
 * @route GET /api/auth/google/callback
 */
export const googleAuthCallback = async (req, res) => {
  try {
    // Get user from passport
    const user = req.user;

    if (!user) {
      console.error("No user data received from Google");
      return res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
    }

    // Create JWT token
    const token = createJWT({ userId: user._id });

    // Prepare user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    // Create default workspace for new users
    if (!(await Workspace.findOne({ owner: user._id }))) {
      // Create default workspace
      const defaultWorkspace = await Workspace.create({
        name: `${user.name}'s Workspace`,
        description:
          "Welcome to your personal workspace! Start organizing your documents and ideas here.",
        owner: user._id,
        emoji: "🏠",
        settings: {
          isPublic: false,
          allowMemberInvites: true,
          defaultPermission: "viewer",
        },
      });

      // Create default document in the workspace
      await Document.create({
        title: "Getting Started",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `Welcome to ${user.name}'s Workspace! 👋\n\nThis is your first document. Here are a few things you can do to get started:\n\n• Edit this document by clicking anywhere on the text\n• Create new documents using the + button in the sidebar\n• Organize documents by dragging them into folders\n• Customize your workspace settings\n\nHappy documenting! 🚀`,
                },
              ],
            },
          ],
        },
        emoji: "👋",
        workspace: defaultWorkspace._id,
        author: user._id,
        lastEditedBy: user._id,
      });
    }

    // Redirect to frontend with token
    res.redirect(`${config.frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
  }
};
