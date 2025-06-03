import { create } from "zustand";
import { documentAPI } from "../redux/api/documentAPI";

// Helper function to build document tree
const buildDocumentTree = (documents) => {
  // Ensure documents is an array to prevent TypeError
  if (!Array.isArray(documents)) {
    console.error("buildDocumentTree received non-array documents:", documents);
    return [];
  }

  const documentMap = new Map();
  const rootDocuments = [];

  // Create a map of all documents
  documents.forEach((doc) => {
    if (doc && doc._id) {
      documentMap.set(doc._id, { ...doc, children: [] });
    }
  });

  // Build the tree structure
  documents.forEach((doc) => {
    if (!doc || !doc._id) return;

    const documentNode = documentMap.get(doc._id);
    if (!documentNode) return;

    if (doc.parent) {
      const parent = documentMap.get(doc.parent);
      if (parent) {
        parent.children.push(documentNode);
        // Sort children by position
        parent.children.sort((a, b) => (a.position || 0) - (b.position || 0));
      }
    } else {
      rootDocuments.push(documentNode);
    }
  });

  // Sort root documents by position
  rootDocuments.sort((a, b) => (a.position || 0) - (b.position || 0));

  return rootDocuments;
};

const useDocumentStore = create((set, get) => ({
  // State
  documents: [],
  currentDocument: null,
  documentTree: [],
  favorites: [],
  searchResults: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  searchLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setCreateLoading: (loading) => set({ createLoading: loading }),
  setUpdateLoading: (loading) => set({ updateLoading: loading }),
  setDeleteLoading: (loading) => set({ deleteLoading: loading }),
  setSearchLoading: (loading) => set({ searchLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  setDocumentTree: (tree) => set({ documentTree: tree }),
  setFavorites: (favorites) => set({ favorites }),
  setSearchResults: (results) => set({ searchResults }),
  clearSearchResults: () => set({ searchResults: [] }),

  // Reset state - important for workspace switching
  resetDocumentState: () =>
    set({
      documents: [],
      currentDocument: null,
      documentTree: [],
      favorites: [],
      searchResults: [],
      loading: false,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      searchLoading: false,
      error: null,
    }),

  addDocument: (document) =>
    set((state) => {
      const newDocuments = [...state.documents, document];
      const documentTree = buildDocumentTree(newDocuments);
      return {
        documents: newDocuments,
        documentTree,
        currentDocument: document, // Set the newly created document as current
      };
    }),

  updateDocument: async (documentId, documentData) => {
    console.log("Document store: Starting update", {
      documentId,
      documentData,
    });
    set({ updateLoading: true, error: null });

    try {
      const response = await documentAPI.updateDocument(
        documentId,
        documentData
      );
      console.log("Document store: Update response", response);

      // Extract document from the success message response
      const updatedDocument = response.data?.document;

      if (!updatedDocument) {
        console.error("Document store: Invalid response format", response);
        throw new Error("No document data in response");
      }

      set((state) => {
        const newDocuments = state.documents.map((doc) =>
          doc._id === documentId ? updatedDocument : doc
        );
        const documentTree = buildDocumentTree(newDocuments);

        return {
          updateLoading: false,
          documents: newDocuments,
          documentTree,
          currentDocument:
            state.currentDocument?._id === documentId
              ? updatedDocument
              : state.currentDocument,
          error: null,
        };
      });

      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to update document";
      console.error("Document store: Update error", {
        error,
        documentId,
        message: errorMessage,
      });

      set({
        updateLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  removeDocument: (documentId) =>
    set((state) => {
      const newDocuments = state.documents.filter(
        (doc) => doc._id !== documentId
      );
      const documentTree = buildDocumentTree(newDocuments);
      return {
        documents: newDocuments,
        documentTree,
        currentDocument:
          state.currentDocument?._id === documentId
            ? null
            : state.currentDocument,
      };
    }),

  moveDocument: ({ documentId, newParent, newPosition }) =>
    set((state) => {
      const newDocuments = state.documents.map((doc) => {
        if (doc._id === documentId) {
          return { ...doc, parent: newParent, position: newPosition };
        }
        return doc;
      });
      const documentTree = buildDocumentTree(newDocuments);
      return { documents: newDocuments, documentTree };
    }),

  reorderDocuments: (reorderedDocs) =>
    set((state) => {
      const newDocuments = state.documents.map((doc) => {
        const reorderedDoc = reorderedDocs.find((rd) => rd._id === doc._id);
        return reorderedDoc ? { ...doc, position: reorderedDoc.position } : doc;
      });
      const documentTree = buildDocumentTree(newDocuments);
      return { documents: newDocuments, documentTree };
    }),

  toggleDocumentFavorite: ({ documentId, isFavorite }) =>
    set((state) => {
      const document = state.documents.find((doc) => doc._id === documentId);
      if (document) {
        document.isFavorite = isFavorite;
      }
      if (state.currentDocument?._id === documentId) {
        state.currentDocument.isFavorite = isFavorite;
      }

      let newFavorites = [...state.favorites];
      if (isFavorite) {
        if (!newFavorites.some((fav) => fav._id === documentId)) {
          newFavorites.push(document);
        }
      } else {
        newFavorites = newFavorites.filter((fav) => fav._id !== documentId);
      }

      return { favorites: newFavorites };
    }),

  isFavorite: (documentId) => {
    const { favorites } = get();
    return (
      Array.isArray(favorites) &&
      favorites.some((fav) => fav._id === documentId)
    );
  },

  // Async Actions
  fetchWorkspaceDocuments: async (workspaceId) => {
    if (!workspaceId) {
      set({ documents: [], documentTree: [], error: null });
      return [];
    }

    set({ loading: true, error: null });

    try {
      const response = await documentAPI.getWorkspaceDocuments(workspaceId);
      const documents = response.data?.documents || [];

      // Build document tree from the documents that belong to this workspace
      const documentTree = Array.isArray(documents)
        ? buildDocumentTree(documents)
        : [];

      set({
        loading: false,
        documents,
        documentTree,
        error: null,
      });

      return documents;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch documents";
      set({
        loading: false,
        error: errorMessage,
        documents: [],
        documentTree: [],
      });
      throw error;
    }
  },

  fetchDocumentById: async (documentId) => {
    set({ loading: true, error: null });

    try {
      const response = await documentAPI.getDocumentById(documentId);
      const document = response.data;

      set({
        loading: false,
        currentDocument: document,
        error: null,
      });

      return document;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch document";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  createDocument: async (documentData) => {
    set({ createLoading: true, error: null });

    try {
      const response = await documentAPI.createDocument(documentData);
      // Extract document from response correctly
      const newDocument = response.data?.document;

      if (!newDocument) {
        throw new Error("No document data returned from API");
      }

      set((state) => {
        // Ensure documents is an array before spreading
        const currentDocs = Array.isArray(state.documents)
          ? state.documents
          : [];
        const newDocuments = [...currentDocs, newDocument];
        const documentTree = buildDocumentTree(newDocuments);
        return {
          createLoading: false,
          documents: newDocuments,
          documentTree,
          error: null,
        };
      });

      return newDocument;
    } catch (error) {
      const errorMessage = error.message || "Failed to create document";

      set({
        createLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  deleteDocument: async (documentId) => {
    set({ deleteLoading: true, error: null });

    try {
      await documentAPI.deleteDocument(documentId);

      set((state) => {
        const newDocuments = state.documents.filter(
          (doc) => doc._id !== documentId
        );
        const documentTree = buildDocumentTree(newDocuments);

        return {
          deleteLoading: false,
          documents: newDocuments,
          documentTree,
          currentDocument:
            state.currentDocument?._id === documentId
              ? null
              : state.currentDocument,
          error: null,
        };
      });

      return documentId;
    } catch (error) {
      const errorMessage = error.message || "Failed to delete document";

      set({
        deleteLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  moveDocument: async (documentId, { newParent, newPosition }) => {
    set({ error: null });

    try {
      const response = await documentAPI.moveDocument(documentId, {
        newParent,
        newPosition,
      });

      set((state) => {
        const newDocuments = state.documents.map((doc) => {
          if (doc._id === documentId) {
            return { ...doc, parent: newParent, position: newPosition };
          }
          return doc;
        });
        const documentTree = buildDocumentTree(newDocuments);

        return {
          documents: newDocuments,
          documentTree,
          error: null,
        };
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to move document";

      set({ error: errorMessage });
      throw error;
    }
  },

  reorderDocuments: async ({ workspaceId, parentId, documentIds }) => {
    set({ error: null });

    try {
      const response = await documentAPI.reorderDocuments(workspaceId, {
        parentId,
        documentIds,
      });

      // Update the order locally
      set((state) => {
        const newDocuments = state.documents.map((doc, index) => {
          const newIndex = documentIds.indexOf(doc._id);
          if (newIndex !== -1) {
            return { ...doc, position: newIndex };
          }
          return doc;
        });
        const documentTree = buildDocumentTree(newDocuments);

        return {
          documents: newDocuments,
          documentTree,
          error: null,
        };
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to reorder documents";

      set({ error: errorMessage });
      throw error;
    }
  },

  toggleFavorite: async (documentId) => {
    set({ error: null });

    try {
      const response = await documentAPI.toggleFavorite(documentId);
      const { isFavorite } = response.data;

      set((state) => {
        const document = state.documents.find((doc) => doc._id === documentId);
        if (document) {
          document.isFavorite = isFavorite;
        }
        if (state.currentDocument?._id === documentId) {
          state.currentDocument.isFavorite = isFavorite;
        }

        // Ensure favorites is always an array
        let newFavorites = Array.isArray(state.favorites)
          ? [...state.favorites]
          : [];
        if (isFavorite) {
          if (!newFavorites.some((fav) => fav._id === documentId)) {
            newFavorites.push(document);
          }
        } else {
          newFavorites = newFavorites.filter((fav) => fav._id !== documentId);
        }

        return { favorites: newFavorites };
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to toggle favorite";

      set({ error: errorMessage });
      throw error;
    }
  },

  fetchFavoriteDocuments: async (workspaceId) => {
    set({ error: null });

    try {
      const response = await documentAPI.getFavoriteDocuments(workspaceId);

      // Ensure favorites is always an array
      const favoriteDocuments = Array.isArray(response.data)
        ? response.data
        : [];

      set({
        favorites: favoriteDocuments,
        error: null,
      });

      return favoriteDocuments;
    } catch (error) {
      const errorMessage =
        error.message || "Failed to fetch favorite documents";

      set({ error: errorMessage });
      throw error;
    }
  },

  searchDocuments: async (workspaceId, searchQuery) => {
    set({ searchLoading: true, error: null });

    try {
      const response = await documentAPI.searchDocuments(
        workspaceId,
        searchQuery
      );

      set({
        searchLoading: false,
        searchResults: response.data,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to search documents";

      set({
        searchLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  getDocumentPath: async (documentId) => {
    set({ error: null });

    try {
      const response = await documentAPI.getDocumentPath(documentId);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to get document path";

      set({ error: errorMessage });
      throw error;
    }
  },

  uploadFile: async (workspaceId, documentId, file) => {
    set({ error: null });

    try {
      const response = await documentAPI.uploadFile(
        workspaceId,
        documentId,
        file
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to upload file";

      set({ error: errorMessage });
      throw error;
    }
  },

  uploadFiles: async (workspaceId, documentId, files) => {
    set({ error: null });

    try {
      const response = await documentAPI.uploadFiles(
        workspaceId,
        documentId,
        files
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to upload files";

      set({ error: errorMessage });
      throw error;
    }
  },
}));

export default useDocumentStore;
