import express from "express";
import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  updateMemberRole,
  getPublicWorkspaces,
  getPublicWorkspaceById,
} from "../controllers/workspace.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateWorkspace,
  validateMember,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// Public routes
router.get("/public", getPublicWorkspaces);
router.get("/public/:workspaceId", getPublicWorkspaceById);

// Protected routes
router.use(protect);

// Workspace CRUD routes
router.post("/", validateWorkspace, createWorkspace);
router.get("/", getUserWorkspaces);
router.get("/:workspaceId", getWorkspaceById);
router.put("/:workspaceId", validateWorkspace, updateWorkspace);
router.delete("/:workspaceId", deleteWorkspace);

// Member management routes
router.post("/:workspaceId/members", validateMember, addMember);
router.delete("/:workspaceId/members/:memberId", removeMember);
router.put("/:workspaceId/members/:memberId/role", updateMemberRole);

export default router;
