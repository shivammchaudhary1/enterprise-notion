import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchWorkspaceDocuments,
  fetchDocumentById,
  createDocumentAction,
  updateDocumentAction,
  deleteDocumentAction,
  moveDocumentAction,
  reorderDocumentsAction,
  toggleFavoriteAction,
  fetchFavoriteDocuments,
  searchDocumentsAction,
} from "../redux/actions/documentActions";
import {
  setCurrentDocument,
  clearError,
  clearSearchResults,
} from "../redux/slices/documentSlice";

export const useDocument = () => {
  const dispatch = useDispatch();
  const {
    documents,
    currentDocument,
    documentTree,
    favorites,
    searchResults,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
    searchLoading,
    error,
  } = useSelector((state) => state.document);

  // Fetch workspace documents
  const loadWorkspaceDocuments = useCallback(
    (workspaceId) => {
      return dispatch(fetchWorkspaceDocuments(workspaceId));
    },
    [dispatch]
  );

  // Fetch document by ID
  const loadDocumentById = useCallback(
    (documentId) => {
      return dispatch(fetchDocumentById(documentId));
    },
    [dispatch]
  );

  // Create document
  const createDocument = useCallback(
    (documentData) => {
      return dispatch(createDocumentAction(documentData));
    },
    [dispatch]
  );

  // Update document
  const updateDocument = useCallback(
    (documentId, documentData) => {
      return dispatch(updateDocumentAction({ documentId, documentData }));
    },
    [dispatch]
  );

  // Delete document
  const deleteDocument = useCallback(
    (documentId) => {
      return dispatch(deleteDocumentAction(documentId));
    },
    [dispatch]
  );

  // Move document
  const moveDocument = useCallback(
    (documentId, newParent, newPosition) => {
      return dispatch(
        moveDocumentAction({ documentId, newParent, newPosition })
      );
    },
    [dispatch]
  );

  // Reorder documents
  const reorderDocuments = useCallback(
    (workspaceId, reorderData) => {
      return dispatch(reorderDocumentsAction({ workspaceId, reorderData }));
    },
    [dispatch]
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    (documentId) => {
      return dispatch(toggleFavoriteAction(documentId));
    },
    [dispatch]
  );

  // Load favorites
  const loadFavoriteDocuments = useCallback(
    (workspaceId) => {
      return dispatch(fetchFavoriteDocuments(workspaceId));
    },
    [dispatch]
  );

  // Search documents
  const searchDocuments = useCallback(
    (workspaceId, searchQuery) => {
      if (!searchQuery.trim()) {
        dispatch(clearSearchResults());
        return Promise.resolve([]);
      }
      return dispatch(searchDocumentsAction({ workspaceId, searchQuery }));
    },
    [dispatch]
  );

  // Set current document
  const setActiveDocument = useCallback(
    (document) => {
      dispatch(setCurrentDocument(document));
    },
    [dispatch]
  );

  // Clear error
  const clearDocumentError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear search results
  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  // Helper functions
  const getDocumentPath = useCallback((documentId, documents) => {
    const path = [];
    let currentDoc = documents.find((doc) => doc._id === documentId);

    while (currentDoc) {
      path.unshift({
        id: currentDoc._id,
        title: currentDoc.title,
        emoji: currentDoc.emoji,
      });

      if (currentDoc.parent) {
        currentDoc = documents.find((doc) => doc._id === currentDoc.parent);
      } else {
        break;
      }
    }

    return path;
  }, []);

  const getChildDocuments = useCallback((parentId, documents) => {
    return documents
      .filter((doc) => doc.parent === parentId)
      .sort((a, b) => a.position - b.position);
  }, []);

  const getRootDocuments = useCallback((documents) => {
    return documents
      .filter((doc) => !doc.parent)
      .sort((a, b) => a.position - b.position);
  }, []);

  const findDocumentById = useCallback((documentId, documents) => {
    return documents.find((doc) => doc._id === documentId);
  }, []);

  const isFavorite = useCallback(
    (documentId) => {
      return favorites.some((fav) => fav._id === documentId);
    },
    [favorites]
  );

  return {
    // State
    documents,
    currentDocument,
    documentTree,
    favorites,
    searchResults,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
    searchLoading,
    error,

    // Actions
    loadWorkspaceDocuments,
    loadDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    moveDocument,
    reorderDocuments,
    toggleFavorite,
    loadFavoriteDocuments,
    searchDocuments,
    setActiveDocument,
    clearDocumentError,
    clearSearch,

    // Helper functions
    getDocumentPath,
    getChildDocuments,
    getRootDocuments,
    findDocumentById,
    isFavorite,
  };
};
