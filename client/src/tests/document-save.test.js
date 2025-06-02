import { describe, it, expect, vi, beforeEach } from "vitest";
import { documentAPI } from "../redux/api/documentAPI";
import useDocumentStore from "../stores/documentStore";

// Mock the API calls
vi.mock("../redux/api/documentAPI", () => ({
  documentAPI: {
    updateDocument: vi.fn(),
  },
}));

describe("Document Saving Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset the store
    useDocumentStore.getState().resetDocumentState();
  });

  it("should successfully update a document", async () => {
    // Mock successful API response
    const mockDocument = {
      _id: "test-doc-id",
      content: { type: "doc", content: [{ type: "paragraph", content: [] }] },
    };

    documentAPI.updateDocument.mockResolvedValueOnce({
      data: {
        document: mockDocument,
      },
    });

    // Get store actions
    const { updateDocument } = useDocumentStore.getState();

    // Attempt to update document
    await updateDocument("test-doc-id", { content: mockDocument.content });

    // Verify API was called correctly
    expect(documentAPI.updateDocument).toHaveBeenCalledWith("test-doc-id", {
      content: mockDocument.content,
    });

    // Verify store was updated
    const state = useDocumentStore.getState();
    expect(state.error).toBeNull();
    expect(state.updateLoading).toBe(false);
  });

  it("should handle update errors correctly", async () => {
    // Mock API error
    const errorMessage = "Failed to update document";
    documentAPI.updateDocument.mockRejectedValueOnce(new Error(errorMessage));

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
