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

describe("Workspace API", () => {
  let authToken;
  let userId;
  let workspaceId;

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

    expect(registerResponse.status).toBe(201);
    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user._id;
  });

  describe("POST /api/workspaces", () => {
    it("should create a new workspace", async () => {
      const workspaceData = {
        name: "Test Workspace",
        description: "A test workspace",
        emoji: "🏠",
      };

      const response = await request(app)
        .post("/api/workspaces")
        .set("Authorization", `Bearer ${authToken}`)
        .send(workspaceData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workspace.name).toBe(workspaceData.name);
      expect(response.body.data.workspace.owner._id).toBe(userId);
      expect(response.body.data.workspace.members).toHaveLength(1);
      expect(response.body.data.workspace.members[0].role).toBe("owner");

      workspaceId = response.body.data.workspace._id;
    });

    it("should fail to create workspace without authentication", async () => {
      const workspaceData = {
        name: "Test Workspace",
      };

      const response = await request(app)
        .post("/api/workspaces")
        .send(workspaceData);

      expect(response.status).toBe(401);
    });

    it("should fail to create workspace without name", async () => {
      const workspaceData = {
        description: "A test workspace",
      };

      const response = await request(app)
        .post("/api/workspaces")
        .set("Authorization", `Bearer ${authToken}`)
        .send(workspaceData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/workspaces", () => {
    beforeEach(async () => {
      // Create test workspace
      const workspace = new Workspace({
        name: "Test Workspace",
        owner: userId,
      });
      await workspace.save();
      workspaceId = workspace._id;
    });

    it("should get user workspaces", async () => {
      const response = await request(app)
        .get("/api/workspaces")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workspaces).toHaveLength(1);
      expect(response.body.data.workspaces[0].name).toBe("Test Workspace");
    });

    it("should fail to get workspaces without authentication", async () => {
      const response = await request(app).get("/api/workspaces");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/workspaces/:workspaceId", () => {
    beforeEach(async () => {
      // Create test workspace
      const workspace = new Workspace({
        name: "Test Workspace",
        owner: userId,
      });
      await workspace.save();
      workspaceId = workspace._id;
    });

    it("should get workspace by ID", async () => {
      const response = await request(app)
        .get(`/api/workspaces/${workspaceId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workspace._id).toBe(workspaceId.toString());
    });

    it("should fail to get non-existent workspace", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/workspaces/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/workspaces/:workspaceId", () => {
    beforeEach(async () => {
      // Create test workspace
      const workspace = new Workspace({
        name: "Test Workspace",
        owner: userId,
      });
      await workspace.save();
      workspaceId = workspace._id;
    });

    it("should update workspace", async () => {
      const updateData = {
        name: "Updated Workspace",
        description: "Updated description",
      };

      const response = await request(app)
        .put(`/api/workspaces/${workspaceId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workspace.name).toBe(updateData.name);
      expect(response.body.data.workspace.description).toBe(
        updateData.description
      );
    });

    it("should fail to update workspace without permission", async () => {
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

      const updateData = {
        name: "Updated Workspace",
      };

      const response = await request(app)
        .put(`/api/workspaces/${workspaceId}`)
        .set("Authorization", `Bearer ${anotherToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /api/workspaces/:workspaceId", () => {
    beforeEach(async () => {
      // Create test workspace
      const workspace = new Workspace({
        name: "Test Workspace",
        owner: userId,
      });
      await workspace.save();
      workspaceId = workspace._id;
    });

    it("should delete workspace", async () => {
      const response = await request(app)
        .delete(`/api/workspaces/${workspaceId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify workspace is soft deleted
      const deletedWorkspace = await Workspace.findById(workspaceId);
      expect(deletedWorkspace.isDeleted).toBe(true);
    });

    it("should fail to delete workspace without ownership", async () => {
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

      const response = await request(app)
        .delete(`/api/workspaces/${workspaceId}`)
        .set("Authorization", `Bearer ${anotherToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("Member Management", () => {
    let secondUserId;
    let secondUserToken;

    beforeEach(async () => {
      // Create test workspace
      const workspace = new Workspace({
        name: "Test Workspace",
        owner: userId,
      });
      await workspace.save();
      workspaceId = workspace._id;

      // Create second user
      const secondUser = new User({
        name: "Second User",
        email: "second@example.com",
        password: "password123",
      });
      await secondUser.save();
      secondUserId = secondUser._id;

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "second@example.com",
        password: "password123",
      });

      secondUserToken = loginResponse.body.data.token;
    });

    it("should add member to workspace", async () => {
      const memberData = {
        email: "second@example.com",
        role: "editor",
      };

      const response = await request(app)
        .post(`/api/workspaces/${workspaceId}/members`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(memberData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workspace.members).toHaveLength(2);
    });

    it("should remove member from workspace", async () => {
      // First add member
      await request(app)
        .post(`/api/workspaces/${workspaceId}/members`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          email: "second@example.com",
          role: "editor",
        });

      // Then remove member
      const response = await request(app)
        .delete(`/api/workspaces/${workspaceId}/members/${secondUserId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workspace.members).toHaveLength(1);
    });

    it("should update member role", async () => {
      // First add member
      await request(app)
        .post(`/api/workspaces/${workspaceId}/members`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          email: "second@example.com",
          role: "viewer",
        });

      // Then update role
      const response = await request(app)
        .put(`/api/workspaces/${workspaceId}/members/${secondUserId}/role`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ role: "admin" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const member = response.body.data.workspace.members.find(
        (m) => m.user._id === secondUserId.toString()
      );
      expect(member.role).toBe("admin");
    });
  });
});
