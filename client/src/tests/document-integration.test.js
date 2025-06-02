import { describe, it, expect, vi, beforeEach } from "vitest";
import { documentAPI } from "../redux/api/documentAPI";
import useDocumentStore from "../stores/documentStore";

// Mock the documentAPI module
vi.mock("../redux/api/documentAPI", () => ({
  documentAPI: {
    updateDocument: vi.fn(),
  },
}));

describe("Document Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDocumentStore.getState().resetDocumentState();
    localStorage.clear();
  });

  it("should save document with proper auth token", async () => {
    // Setup auth token
    const mockToken = "test-token";
    localStorage.setItem("auth_token", mockToken);

    // Mock successful response
    const mockDocument = {
      _id: "test-doc-id",
      content: { type: "doc", content: [{ type: "paragraph", content: [] }] },
      workspace: { _id: "test-workspace" },
      author: { _id: "test-user", name: "Test User" },
    };

    const mockResponse = {
      success: true,
      message: "Document updated successfully",
      data: {
        document: mockDocument,
      },
    };

    // Setup API mock
    documentAPI.updateDocument.mockResolvedValueOnce(mockResponse);

    // Get store actions
    const { updateDocument } = useDocumentStore.getState();

    // Attempt to update document
    await updateDocument("test-doc-id", {
      content: mockDocument.content,
    });

    // Verify API was called with correct data
    expect(documentAPI.updateDocument).toHaveBeenCalledWith("test-doc-id", {
      content: mockDocument.content,
    });

    // Verify store state
    const state = useDocumentStore.getState();
    expect(state.error).toBeNull();
    expect(state.updateLoading).toBe(false);
  });

  it("should handle API errors gracefully", async () => {
    // Setup auth token
    const mockToken = "test-token";
    localStorage.setItem("auth_token", mockToken);

    // Setup API mock with error
    const errorResponse = new Error("Failed to update document");
    documentAPI.updateDocument.mockRejectedValueOnce(errorResponse);

    // Get store actions
    const { updateDocument } = useDocumentStore.getState();

    // Attempt to update document and expect it to throw
    await expect(
      updateDocument("test-doc-id", { content: {} })
    ).rejects.toThrow();

    // Verify error state
    const state = useDocumentStore.getState();
    expect(state.error).toBeTruthy();
    expect(state.updateLoading).toBe(false);
  });
});
