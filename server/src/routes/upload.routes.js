import express from "express";
import {
  uploadFile,
  uploadFiles,
  deleteFile,
  getFile,
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  verifyWorkspaceAccess,
} from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// File upload routes
router.post(
  "/:workspaceId/single",
  verifyWorkspaceAccess,
  uploadSingle,
  uploadFile
);
router.post(
  "/:workspaceId/multiple",
  verifyWorkspaceAccess,
  uploadMultiple,
  uploadFiles
);

// File management routes
router.get("/:workspaceId/:filename", getFile);
router.delete("/:workspaceId/:filename", verifyWorkspaceAccess, deleteFile);

// Error handling middleware
router.use(handleUploadError);

export default router;
