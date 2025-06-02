import request from "supertest";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../src/models/user.model.js";
import Workspace from "../src/models/workspace.model.js";
import Document from "../src/models/document.model.js";

describe("Document API", () => {
  let authToken;
  let userId;
  let workspaceId;
  let documentId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(
      process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/novadocs_test"
    );
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await Document.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await Document.deleteMany({});

    // Create test user and get auth token
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send(userData);

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user._id;

    // Create test workspace
    const workspace = new Workspace({
      name: "Test Workspace",
      owner: userId,
    });
    await workspace.save();
    workspaceId = workspace._id;
  });

  describe("POST /api/documents", () => {
    it("should create a new document", async () => {
      const documentData = {
        title: "Test Document",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Hello world" }],
            },
          ],
        },
        emoji: "📄",
        workspaceId: workspaceId.toString(),
      };

      const response = await request(app)
        .post("/api/documents")
        .set("Authorization", `Bearer ${authToken}`)
        .send(documentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.document.title).toBe(documentData.title);
      expect(response.body.data.document.author._id).toBe(userId);
      expect(response.body.data.document.workspace._id).toBe(
        workspaceId.toString()
      );

      documentId = response.body.data.document._id;
    });

    it("should create a nested document", async () => {
      // First create parent document
      const parentDoc = new Document({
        title: "Parent Document",
        workspace: workspaceId,
        author: userId,
      });
      await parentDoc.save();

      const documentData = {
        title: "Child Document",
        workspaceId: workspaceId.toString(),
        parentId: parentDoc._id.toString(),
      };

      const response = await request(app)
        .post("/api/documents")
        .set("Authorization", `Bearer ${authToken}`)
        .send(documentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.document.parent).toBe(parentDoc._id.toString());
    });

    it("should fail to create document without authentication", async () => {
      const documentData = {
        title: "Test Document",
        workspaceId: workspaceId.toString(),
      };

      const response = await request(app)
        .post("/api/documents")
        .send(documentData);

      expect(response.status).toBe(401);
    });

    it("should fail to create document without workspace access", async () => {
      // Create another user
      const anotherUser = new User({
        name: "Another User",
        email: "another@example.com",
        password: "password123",
      });
      await anotherUser.save();

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "another@example.com",
        password: "password123",
      });

      const anotherToken = loginResponse.body.data.token;

      const documentData = {
        title: "Test Document",
        workspaceId: workspaceId.toString(),
      };

      const response = await request(app)
        .post("/api/documents")
        .set("Authorization", `Bearer ${anotherToken}`)
        .send(documentData);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/documents/workspace/:workspaceId", () => {
    beforeEach(async () => {
      // Create test documents
      const doc1 = new Document({
        title: "Document 1",
        workspace: workspaceId,
        author: userId,
        position: 0,
      });
      await doc1.save();

      const doc2 = new Document({
        title: "Document 2",
        workspace: workspaceId,
        author: userId,
        position: 1,
      });
      await doc2.save();

      documentId = doc1._id;
    });

    it("should get workspace documents", async () => {
      const response = await request(app)
        .get(`/api/documents/workspace/${workspaceId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.documents).toHaveLength(2);
      expect(response.body.data.documents[0].title).toBe("Document 1");
      expect(response.body.data.documents[1].title).toBe("Document 2");
    });

    it("should get document tree", async () => {
      // Create nested documents
      const childDoc = new Document({
        title: "Child Document",
        workspace: workspaceId,
        author: userId,
        parent: documentId,
        position: 0,
      });
      await childDoc.save();

      const response = await request(app)
        .get(`/api/documents/workspace/${workspaceId}?tree=true`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.documents).toHaveLength(2);

      // Find the parent document and check if it has children
      const parentDoc = response.body.data.documents.find(
        (doc) => doc._id === documentId.toString()
      );
      expect(parentDoc.children).toHaveLength(1);
      expect(parentDoc.children[0].title).toBe("Child Document");
    });
  });

  describe("GET /api/documents/:documentId", () => {
    beforeEach(async () => {
      const document = new Document({
        title: "Test Document",
        workspace: workspaceId,
        author: userId,
      });
      await document.save();
      documentId = document._id;
    });

    it("should get document by ID", async () => {
      const response = await request(app)
        .get(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.document._id).toBe(documentId.toString());
      expect(response.body.data.document.title).toBe("Test Document");
    });

    it("should increment view count", async () => {
      const initialResponse = await request(app)
        .get(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      const initialViewCount =
        initialResponse.body.data.document.metadata.viewCount;

      const secondResponse = await request(app)
        .get(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(secondResponse.body.data.document.metadata.viewCount).toBe(
        initialViewCount + 1
      );
    });

    it("should fail to get non-existent document", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/documents/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/documents/:documentId", () => {
    beforeEach(async () => {
      const document = new Document({
        title: "Test Document",
        workspace: workspaceId,
        author: userId,
      });
      await document.save();
      documentId = document._id;
    });

    it("should update document", async () => {
      const updateData = {
        title: "Updated Document",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Updated content" }],
            },
          ],
        },
        emoji: "✏️",
      };

      const response = await request(app)
        .put(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.document.title).toBe(updateData.title);
      expect(response.body.data.document.emoji).toBe(updateData.emoji);
      expect(response.body.data.document.version).toBe(2);
    });

    it("should update lastEditedBy", async () => {
      const updateData = {
        title: "Updated Document",
      };

      const response = await request(app)
        .put(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.document.lastEditedBy._id).toBe(userId);
    });
  });

  describe("DELETE /api/documents/:documentId", () => {
    beforeEach(async () => {
      const document = new Document({
        title: "Test Document",
        workspace: workspaceId,
        author: userId,
      });
      await document.save();
      documentId = document._id;
    });

    it("should delete document", async () => {
      const response = await request(app)
        .delete(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify document is soft deleted
      const deletedDocument = await Document.findById(documentId);
      expect(deletedDocument.isDeleted).toBe(true);
    });

    it("should delete document and its children", async () => {
      // Create child document
      const childDoc = new Document({
        title: "Child Document",
        workspace: workspaceId,
        author: userId,
        parent: documentId,
      });
      await childDoc.save();

      const response = await request(app)
        .delete(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify both parent and child are deleted
      const deletedParent = await Document.findById(documentId);
      const deletedChild = await Document.findById(childDoc._id);

      expect(deletedParent.isDeleted).toBe(true);
      expect(deletedChild.isDeleted).toBe(true);
    });
  });

  describe("Document Favorites", () => {
    beforeEach(async () => {
      const document = new Document({
        title: "Test Document",
        workspace: workspaceId,
        author: userId,
      });
      await document.save();
      documentId = document._id;
    });

    it("should toggle favorite status", async () => {
      // Add to favorites
      const response1 = await request(app)
        .post(`/api/documents/${documentId}/favorite`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response1.status).toBe(200);
      expect(response1.body.data.isFavorited).toBe(true);

      // Remove from favorites
      const response2 = await request(app)
        .post(`/api/documents/${documentId}/favorite`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response2.status).toBe(200);
      expect(response2.body.data.isFavorited).toBe(false);
    });

    it("should get favorite documents", async () => {
      // Add document to favorites
      await request(app)
        .post(`/api/documents/${documentId}/favorite`)
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app)
        .get(`/api/documents/workspace/${workspaceId}/favorites`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.documents).toHaveLength(1);
      expect(response.body.data.documents[0]._id).toBe(documentId.toString());
    });
  });

  describe("Document Search", () => {
    beforeEach(async () => {
      // Create multiple documents for search testing
      const documents = [
        {
          title: "JavaScript Tutorial",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Learn JavaScript programming" },
                ],
              },
            ],
          },
          metadata: { tags: ["programming", "javascript"] },
        },
        {
          title: "React Guide",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Learn React framework" }],
              },
            ],
          },
          metadata: { tags: ["programming", "react"] },
        },
        {
          title: "Cooking Recipe",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "How to cook pasta" }],
              },
            ],
          },
          metadata: { tags: ["cooking", "recipe"] },
        },
      ];

      for (const docData of documents) {
        const doc = new Document({
          ...docData,
          workspace: workspaceId,
          author: userId,
        });
        await doc.save();
      }
    });

    it("should search documents by text", async () => {
      const response = await request(app)
        .get(`/api/documents/workspace/${workspaceId}/search?q=JavaScript`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.documents).toHaveLength(1);
      expect(response.body.data.documents[0].title).toBe("JavaScript Tutorial");
    });

    it("should search documents by tags", async () => {
      const response = await request(app)
        .get(`/api/documents/workspace/${workspaceId}/search?tags=programming`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.documents).toHaveLength(2);
    });

    it("should limit search results", async () => {
      const response = await request(app)
        .get(`/api/documents/workspace/${workspaceId}/search?limit=1`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.documents).toHaveLength(1);
      expect(response.body.data.limit).toBe(1);
    });
  });

  describe("Document Reordering", () => {
    let doc1Id, doc2Id, doc3Id;

    beforeEach(async () => {
      // Create documents in order
      const doc1 = new Document({
        title: "Document 1",
        workspace: workspaceId,
        author: userId,
        position: 0,
      });
      await doc1.save();
      doc1Id = doc1._id;

      const doc2 = new Document({
        title: "Document 2",
        workspace: workspaceId,
        author: userId,
        position: 1,
      });
      await doc2.save();
      doc2Id = doc2._id;

      const doc3 = new Document({
        title: "Document 3",
        workspace: workspaceId,
        author: userId,
        position: 2,
      });
      await doc3.save();
      doc3Id = doc3._id;
    });

    it("should reorder documents", async () => {
      const newOrder = [
        doc3Id.toString(),
        doc1Id.toString(),
        doc2Id.toString(),
      ];

      const response = await request(app)
        .put(`/api/documents/workspace/${workspaceId}/reorder`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          parentId: null,
          documentIds: newOrder,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify new order
      const documents = await Document.find({
        workspace: workspaceId,
        parent: null,
        isDeleted: false,
      }).sort({ position: 1 });

      expect(documents[0]._id.toString()).toBe(doc3Id.toString());
      expect(documents[1]._id.toString()).toBe(doc1Id.toString());
      expect(documents[2]._id.toString()).toBe(doc2Id.toString());
    });
  });
});
