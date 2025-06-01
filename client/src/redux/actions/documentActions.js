import { createAsyncThunk } from "@reduxjs/toolkit";
import { documentAPI } from "../api/documentAPI";
import {
  setLoading,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
  setSearchLoading,
  setError,
  setDocuments,
  setCurrentDocument,
  setDocumentTree,
  addDocument,
  updateDocument,
  removeDocument,
  moveDocument,
  reorderDocuments,
  setFavorites,
  toggleDocumentFavorite,
  setSearchResults,
} from "../slices/documentSlice";

// Fetch workspace documents
export const fetchWorkspaceDocuments = createAsyncThunk(
  "document/fetchWorkspaceDocuments",
  async (workspaceId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await documentAPI.getWorkspaceDocuments(workspaceId);
      dispatch(setDocuments(response.data));

      // Build document tree structure
      const documentTree = buildDocumentTree(response.data);
      dispatch(setDocumentTree(documentTree));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch documents";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Fetch document by ID
export const fetchDocumentById = createAsyncThunk(
  "document/fetchDocumentById",
  async (documentId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await documentAPI.getDocumentById(documentId);
      dispatch(setCurrentDocument(response.data));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch document";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Create document
export const createDocumentAction = createAsyncThunk(
  "document/createDocument",
  async (documentData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setCreateLoading(true));
      dispatch(setError(null));

      const response = await documentAPI.createDocument(documentData);
      dispatch(addDocument(response.data));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to create document";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setCreateLoading(false));
    }
  }
);

// Update document
export const updateDocumentAction = createAsyncThunk(
  "document/updateDocument",
  async ({ documentId, documentData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUpdateLoading(true));
      dispatch(setError(null));

      const response = await documentAPI.updateDocument(
        documentId,
        documentData
      );
      dispatch(updateDocument(response.data));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to update document";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setUpdateLoading(false));
    }
  }
);

// Delete document
export const deleteDocumentAction = createAsyncThunk(
  "document/deleteDocument",
  async (documentId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setDeleteLoading(true));
      dispatch(setError(null));

      await documentAPI.deleteDocument(documentId);
      dispatch(removeDocument(documentId));

      return documentId;
    } catch (error) {
      const errorMessage = error.message || "Failed to delete document";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setDeleteLoading(false));
    }
  }
);

// Move document
export const moveDocumentAction = createAsyncThunk(
  "document/moveDocument",
  async (
    { documentId, newParent, newPosition },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setError(null));

      const response = await documentAPI.moveDocument(documentId, {
        newParent,
        newPosition,
      });
      dispatch(moveDocument({ documentId, newParent, newPosition }));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to move document";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Reorder documents
export const reorderDocumentsAction = createAsyncThunk(
  "document/reorderDocuments",
  async ({ workspaceId, reorderData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      const response = await documentAPI.reorderDocuments(
        workspaceId,
        reorderData
      );
      dispatch(reorderDocuments(reorderData));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to reorder documents";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Toggle favorite
export const toggleFavoriteAction = createAsyncThunk(
  "document/toggleFavorite",
  async (documentId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      const response = await documentAPI.toggleFavorite(documentId);
      dispatch(
        toggleDocumentFavorite({
          documentId,
          isFavorite: response.data.isFavorite,
        })
      );

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to toggle favorite";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch favorite documents
export const fetchFavoriteDocuments = createAsyncThunk(
  "document/fetchFavoriteDocuments",
  async (workspaceId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      const response = await documentAPI.getFavoriteDocuments(workspaceId);
      dispatch(setFavorites(response.data));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.message || "Failed to fetch favorite documents";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Search documents
export const searchDocumentsAction = createAsyncThunk(
  "document/searchDocuments",
  async ({ workspaceId, searchQuery }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSearchLoading(true));
      dispatch(setError(null));

      const response = await documentAPI.searchDocuments(
        workspaceId,
        searchQuery
      );
      dispatch(setSearchResults(response.data));

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to search documents";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setSearchLoading(false));
    }
  }
);

// Get document path/breadcrumb
export const getDocumentPathAction = createAsyncThunk(
  "document/getDocumentPath",
  async (documentId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      const response = await documentAPI.getDocumentPath(documentId);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to get document path";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Upload single file
export const uploadFileAction = createAsyncThunk(
  "document/uploadFile",
  async ({ workspaceId, documentId, file }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      const response = await documentAPI.uploadFile(
        workspaceId,
        documentId,
        file
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to upload file";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Upload multiple files
export const uploadFilesAction = createAsyncThunk(
  "document/uploadFiles",
  async ({ workspaceId, documentId, files }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      const response = await documentAPI.uploadFiles(
        workspaceId,
        documentId,
        files
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to upload files";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Helper function to build document tree
const buildDocumentTree = (documents) => {
  const documentMap = new Map();
  const rootDocuments = [];

  // Create a map of all documents
  documents.forEach((doc) => {
    documentMap.set(doc._id, { ...doc, children: [] });
  });

  // Build the tree structure
  documents.forEach((doc) => {
    const documentNode = documentMap.get(doc._id);

    if (doc.parent) {
      const parent = documentMap.get(doc.parent);
      if (parent) {
        parent.children.push(documentNode);
      }
    } else {
      rootDocuments.push(documentNode);
    }
  });

  // Sort by position
  const sortByPosition = (a, b) => a.position - b.position;

  const sortTree = (nodes) => {
    nodes.sort(sortByPosition);
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        sortTree(node.children);
      }
    });
  };

  sortTree(rootDocuments);

  return rootDocuments;
};
