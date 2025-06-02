import express from "express";
import {
  getInvitationByToken,
  acceptInvitation,
  getWorkspaceInvitations,
  cancelInvitation,
  resendInvitation,
} from "../controllers/invitation.controller.js";
import { protect, optionalAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route - get invitation details by token (no auth required)
router.get("/:token", getInvitationByToken);

// Accept invitation - uses optional auth (works for both authenticated and non-authenticated users)
router.post("/:token/accept", optionalAuth, acceptInvitation);

// Protected routes
router.use(protect);

// Workspace invitation management routes
router.get("/workspace/:workspaceId", getWorkspaceInvitations);
router.delete("/:invitationId", cancelInvitation);
router.post("/:invitationId/resend", resendInvitation);

export default router;
