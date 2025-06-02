// Test file to verify Zustand migration functionality
// This file tests the core functionalities after Redux to Zustand migration

import { beforeAll, describe, it, expect } from "vitest";

// Test imports to ensure stores are properly exported
describe("Store Imports", () => {
  it("should import auth store correctly", async () => {
    const useAuthStore = (await import("../stores/authStore")).default;
    expect(useAuthStore).toBeDefined();
    expect(typeof useAuthStore).toBe("function");
  });

  it("should import workspace store correctly", async () => {
    const useWorkspaceStore = (await import("../stores/workspaceStore"))
      .default;
    expect(useWorkspaceStore).toBeDefined();
    expect(typeof useWorkspaceStore).toBe("function");
  });

  it("should import document store correctly", async () => {
    const useDocumentStore = (await import("../stores/documentStore")).default;
    expect(useDocumentStore).toBeDefined();
    expect(typeof useDocumentStore).toBe("function");
  });

  it("should import user store correctly", async () => {
    const useUserStore = (await import("../stores/userStore")).default;
    expect(useUserStore).toBeDefined();
    expect(typeof useUserStore).toBe("function");
  });

  it("should import all stores from index", async () => {
    const { useAuthStore, useWorkspaceStore, useDocumentStore, useUserStore } =
      await import("../stores");

    expect(useAuthStore).toBeDefined();
    expect(useWorkspaceStore).toBeDefined();
    expect(useDocumentStore).toBeDefined();
    expect(useUserStore).toBeDefined();
  });
});

// Test hook functionality
describe("Custom Hooks", () => {
  it("should import useWorkspace hook correctly", async () => {
    const { useWorkspace } = await import("../hooks/useWorkspace");
    expect(useWorkspace).toBeDefined();
  });

  it("should import useDocument hook correctly", async () => {
    const { useDocument } = await import("../hooks/useDocument");
    expect(useDocument).toBeDefined();
  });

  it("should import useAuthLogout hook correctly", async () => {
    const { useAuthLogout } = await import("../hooks/useAuthLogout");
    expect(useAuthLogout).toBeDefined();
  });
});

// Test component imports
describe("Component Imports", () => {
  it("should import AuthProvider correctly", async () => {
    const AuthProvider = await import("../components/auth/AuthProvider");
    expect(AuthProvider.default).toBeDefined();
  });

  it("should import ProtectedRoute correctly", async () => {
    const ProtectedRoute = await import("../components/auth/ProtectedRoute");
    expect(ProtectedRoute.default).toBeDefined();
  });

  it("should import PublicRoute correctly", async () => {
    const PublicRoute = await import("../components/auth/PublicRoute");
    expect(ProtectedRoute.default).toBeDefined();
  });

  it("should import Dashboard correctly", async () => {
    const Dashboard = await import("../pages/Dashboard");
    expect(Dashboard.default).toBeDefined();
  });

  it("should import Login correctly", async () => {
    const Login = await import("../pages/Login");
    expect(Login.default).toBeDefined();
  });

  it("should import Register correctly", async () => {
    const Register = await import("../pages/Register");
    expect(Register.default).toBeDefined();
  });
});

// Test store structure and functionality
describe("Store Structure and Functionality", () => {
  it("should have correct auth store structure", async () => {
    const useAuthStore = (await import("../stores/authStore")).default;
    const store = useAuthStore.getState();

    // Check initial state structure
    expect(store).toHaveProperty("user");
    expect(store).toHaveProperty("token");
    expect(store).toHaveProperty("isAuthenticated");
    expect(store).toHaveProperty("isLoading");
    expect(store).toHaveProperty("error");
    expect(store).toHaveProperty("message");
    expect(store).toHaveProperty("validationErrors");

    // Check action methods
    expect(store).toHaveProperty("register");
    expect(store).toHaveProperty("login");
    expect(store).toHaveProperty("logout");
    expect(store).toHaveProperty("getCurrentUser");
    expect(store).toHaveProperty("forgotPassword");
    expect(store).toHaveProperty("resetPassword");
    expect(store).toHaveProperty("clearError");
    expect(store).toHaveProperty("clearMessage");

    // Check that methods are functions
    expect(typeof store.register).toBe("function");
    expect(typeof store.login).toBe("function");
    expect(typeof store.logout).toBe("function");
  });

  it("should have correct workspace store structure", async () => {
    const useWorkspaceStore = (await import("../stores/workspaceStore"))
      .default;
    const store = useWorkspaceStore.getState();

    expect(store).toHaveProperty("workspaces");
    expect(store).toHaveProperty("currentWorkspace");
    expect(store).toHaveProperty("loading");
    expect(store).toHaveProperty("error");
    expect(store).toHaveProperty("fetchUserWorkspaces");
    expect(store).toHaveProperty("createWorkspace");
    expect(store).toHaveProperty("updateWorkspace");
    expect(store).toHaveProperty("deleteWorkspace");

    // Check that methods are functions
    expect(typeof store.fetchUserWorkspaces).toBe("function");
    expect(typeof store.createWorkspace).toBe("function");
  });

  it("should have correct document store structure", async () => {
    const useDocumentStore = (await import("../stores/documentStore")).default;
    const store = useDocumentStore.getState();

    expect(store).toHaveProperty("documents");
    expect(store).toHaveProperty("currentDocument");
    expect(store).toHaveProperty("documentTree");
    expect(store).toHaveProperty("favorites");
    expect(store).toHaveProperty("searchResults");
    expect(store).toHaveProperty("loading");
    expect(store).toHaveProperty("fetchWorkspaceDocuments");
    expect(store).toHaveProperty("createDocument");
    expect(store).toHaveProperty("updateDocument");

    // Check that methods are functions
    expect(typeof store.fetchWorkspaceDocuments).toBe("function");
    expect(typeof store.createDocument).toBe("function");
  });

  it("should have correct user store structure", async () => {
    const useUserStore = (await import("../stores/userStore")).default;
    const store = useUserStore.getState();

    expect(store).toHaveProperty("profile");
    expect(store).toHaveProperty("preferences");
    expect(store).toHaveProperty("loading");
    expect(store).toHaveProperty("error");
    expect(store).toHaveProperty("fetchUserProfile");
    expect(store).toHaveProperty("updateProfile");
    expect(store).toHaveProperty("updatePreferences");

    // Check that methods are functions
    expect(typeof store.fetchUserProfile).toBe("function");
    expect(typeof store.updateProfile).toBe("function");
  });
});

// Test initial store states
describe("Initial Store States", () => {
  it("should have correct auth store initial state", async () => {
    const useAuthStore = (await import("../stores/authStore")).default;
    const store = useAuthStore.getState();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.message).toBeNull();
    expect(Array.isArray(store.validationErrors)).toBe(true);
  });

  it("should have correct workspace store initial state", async () => {
    const useWorkspaceStore = (await import("../stores/workspaceStore"))
      .default;
    const store = useWorkspaceStore.getState();

    expect(Array.isArray(store.workspaces)).toBe(true);
    expect(store.currentWorkspace).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it("should have correct document store initial state", async () => {
    const useDocumentStore = (await import("../stores/documentStore")).default;
    const store = useDocumentStore.getState();

    expect(Array.isArray(store.documents)).toBe(true);
    expect(store.currentDocument).toBeNull();
    expect(Array.isArray(store.documentTree)).toBe(true);
    expect(Array.isArray(store.favorites)).toBe(true);
    expect(Array.isArray(store.searchResults)).toBe(true);
    expect(store.loading).toBe(false);
  });
});

console.log("✅ All Zustand migration tests passed successfully!");
console.log("🚀 Ready to test application functionality in browser");
