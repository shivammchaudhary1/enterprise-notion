import { useCallback } from "react";
import { useDocumentStore } from "../stores";

export const useDocument = () => {
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
    fetchWorkspaceDocuments,
    fetchDocumentById,
    createDocument: createDocumentAction,
    updateDocument: updateDocumentAction,
    deleteDocument: deleteDocumentAction,
    moveDocument: moveDocumentAction,
    reorderDocuments: reorderDocumentsAction,
    toggleFavorite: toggleFavoriteAction,
    fetchFavoriteDocuments,
    searchDocuments: searchDocumentsAction,
    getDocumentPath: getDocumentPathAction,
    uploadFile: uploadFileAction,
    uploadFiles: uploadFilesAction,
    setCurrentDocument,
    clearError,
    clearSearchResults,
  } = useDocumentStore();

  // Fetch workspace documents
  const loadWorkspaceDocuments = useCallback(
    (workspaceId) => {
      return fetchWorkspaceDocuments(workspaceId);
    },
    [fetchWorkspaceDocuments]
  );

  // Fetch document by ID
  const loadDocumentById = useCallback(
    (documentId) => {
      return fetchDocumentById(documentId);
    },
    [fetchDocumentById]
  );

  // Create document
  const createDocument = useCallback(
    (documentData) => {
      return createDocumentAction(documentData);
    },
    [createDocumentAction]
  );

  // Update document
  const updateDocument = useCallback(
    async (documentId, documentData) => {
      try {
        const response = await updateDocumentAction(documentId, documentData);
        return response;
      } catch (error) {
        console.error("Document update error in hook:", error);
        throw error;
      }
    },
    [updateDocumentAction]
  );

  // Delete document
  const deleteDocument = useCallback(
    (documentId) => {
      return deleteDocumentAction(documentId);
    },
    [deleteDocumentAction]
  );

  // Move document
  const moveDocument = useCallback(
    (documentId, newParent, newPosition) => {
      return moveDocumentAction(documentId, newParent, newPosition);
    },
    [moveDocumentAction]
  );

  // Reorder documents
  const reorderDocuments = useCallback(
    (workspaceId, reorderData) => {
      return reorderDocumentsAction(workspaceId, reorderData);
    },
    [reorderDocumentsAction]
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    (documentId) => {
      return toggleFavoriteAction(documentId);
    },
    [toggleFavoriteAction]
  );

  // Load favorites
  const loadFavoriteDocuments = useCallback(
    (workspaceId) => {
      return fetchFavoriteDocuments(workspaceId);
    },
    [fetchFavoriteDocuments]
  );

  // Search documents
  const searchDocuments = useCallback(
    (searchParams) => {
      if (!searchParams.query || !searchParams.query.trim()) {
        clearSearchResults();
        return Promise.resolve([]);
      }
      return searchDocumentsAction(searchParams);
    },
    [searchDocumentsAction, clearSearchResults]
  );

  // Get document path for breadcrumbs
  const getDocumentPath = useCallback(
    (documentId) => {
      return getDocumentPathAction(documentId);
    },
    [getDocumentPathAction]
  );

  // Upload file
  const uploadFile = useCallback(
    (workspaceId, file) => {
      return uploadFileAction(workspaceId, file);
    },
    [uploadFileAction]
  );

  // Upload multiple files
  const uploadFiles = useCallback(
    (workspaceId, files) => {
      return uploadFilesAction(workspaceId, files);
    },
    [uploadFilesAction]
  );

  // Set current document
  const setActiveDocument = useCallback(
    (document) => {
      setCurrentDocument(document);
    },
    [setCurrentDocument]
  );

  // Clear error
  const clearDocumentError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Clear search results
  const clearSearch = useCallback(() => {
    clearSearchResults();
  }, [clearSearchResults]);

  // Helper functions
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
      // Make sure favorites is an array before using .some()
      return (
        Array.isArray(favorites) &&
        favorites.some((fav) => fav._id === documentId)
      );
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
    getDocumentPath,
    uploadFile,
    uploadFiles,
    setActiveDocument,
    clearDocumentError,
    clearSearch,

    // Helper functions
    getChildDocuments,
    getRootDocuments,
    findDocumentById,
    isFavorite,
  };
};
