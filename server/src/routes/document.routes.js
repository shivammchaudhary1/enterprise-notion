import express from "express";
import {
  createDocument,
  getWorkspaceDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  moveDocument,
  reorderDocuments,
  toggleFavorite,
  getUserFavorites,
  searchDocuments,
  getDocumentPath,
  duplicateDocument,
} from "../controllers/document.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateDocument } from "../middleware/validation.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Document CRUD routes
router.post("/", validateDocument, createDocument);
router.get("/workspace/:workspaceId", getWorkspaceDocuments);
router.get("/:documentId", getDocumentById);
router.put("/:documentId", validateDocument, updateDocument);
router.delete("/:documentId", deleteDocument);

// Document operations
router.put("/:documentId/move", moveDocument);
router.put("/workspace/:workspaceId/reorder", reorderDocuments);
router.post("/:documentId/duplicate", duplicateDocument);

// Favorites
router.post("/:documentId/favorite", toggleFavorite);
router.get("/workspace/:workspaceId/favorites", getUserFavorites);

// Search
router.get("/workspace/:workspaceId/search", searchDocuments);

// Document path
router.get("/:documentId/path", getDocumentPath);

export default router;
