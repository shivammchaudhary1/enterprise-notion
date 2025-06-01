import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Document API functions
export const documentAPI = {
  // Get workspace documents
  getWorkspaceDocuments: async (workspaceId) => {
    try {
      const response = await api.get(`/documents/workspace/${workspaceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get document by ID
  getDocumentById: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new document
  createDocument: async (documentData) => {
    try {
      const response = await api.post("/documents", documentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update document
  updateDocument: async (documentId, documentData) => {
    try {
      const response = await api.put(`/documents/${documentId}`, documentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Move document
  moveDocument: async (documentId, moveData) => {
    try {
      const response = await api.put(`/documents/${documentId}/move`, moveData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reorder documents
  reorderDocuments: async (workspaceId, reorderData) => {
    try {
      const response = await api.put(
        `/documents/workspace/${workspaceId}/reorder`,
        reorderData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle favorite
  toggleFavorite: async (documentId) => {
    try {
      const response = await api.post(`/documents/${documentId}/favorite`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get favorite documents
  getFavoriteDocuments: async (workspaceId) => {
    try {
      const response = await api.get(
        `/documents/workspace/${workspaceId}/favorites`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search documents
  searchDocuments: async (workspaceId, searchQuery) => {
    try {
      const response = await api.get(
        `/documents/workspace/${workspaceId}/search`,
        {
          params: { q: searchQuery },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default documentAPI;
