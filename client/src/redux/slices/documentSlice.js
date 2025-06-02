import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documents: [],
  currentDocument: null,
  documentTree: [],
  favorites: [],
  searchResults: [],
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  searchLoading: false,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCreateLoading: (state, action) => {
      state.createLoading = action.payload;
    },
    setUpdateLoading: (state, action) => {
      state.updateLoading = action.payload;
    },
    setDeleteLoading: (state, action) => {
      state.deleteLoading = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.searchLoading = action.payload;
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Document CRUD operations
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    setDocumentTree: (state, action) => {
      state.documentTree = action.payload;
    },
    addDocument: (state, action) => {
      state.documents.push(action.payload);
    },
    updateDocument: (state, action) => {
      const index = state.documents.findIndex(
        (doc) => doc._id === action.payload._id
      );
      if (index !== -1) {
        state.documents[index] = action.payload;
      }
      if (state.currentDocument?._id === action.payload._id) {
        state.currentDocument = action.payload;
      }
    },
    removeDocument: (state, action) => {
      state.documents = state.documents.filter(
        (doc) => doc._id !== action.payload
      );
      if (state.currentDocument?._id === action.payload) {
        state.currentDocument = null;
      }
    },

    // Document operations
    moveDocument: (state, action) => {
      const { documentId, newParent, newPosition } = action.payload;
      const document = state.documents.find((doc) => doc._id === documentId);
      if (document) {
        document.parent = newParent;
        document.position = newPosition;
      }
    },
    reorderDocuments: (state, action) => {
      const reorderedDocs = action.payload;
      reorderedDocs.forEach((doc) => {
        const index = state.documents.findIndex((d) => d._id === doc._id);
        if (index !== -1) {
          state.documents[index].position = doc.position;
        }
      });
    },

    // Favorites management
    setFavorites: (state, action) => {
      // Ensure payload is always an array
      state.favorites = Array.isArray(action.payload) ? action.payload : [];
    },
    toggleDocumentFavorite: (state, action) => {
      const { documentId, isFavorite } = action.payload;
      const document = state.documents.find((doc) => doc._id === documentId);
      if (document) {
        document.isFavorite = isFavorite;
      }
      if (state.currentDocument?._id === documentId) {
        state.currentDocument.isFavorite = isFavorite;
      }

      // Ensure favorites is always an array
      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
      }

      if (isFavorite) {
        if (!state.favorites.some((fav) => fav._id === documentId)) {
          state.favorites.push(document);
        }
      } else {
        state.favorites = state.favorites.filter(
          (fav) => fav._id !== documentId
        );
      }
    },

    // Search
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    // Reset state
    resetDocumentState: () => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
  setSearchLoading,
  setError,
  clearError,
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
  clearSearchResults,
  resetDocumentState,
} = documentSlice.actions;

export default documentSlice.reducer;
