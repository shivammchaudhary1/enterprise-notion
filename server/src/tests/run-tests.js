#!/usr/bin/env node

// Simple test runner without Jest
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Test setup
let mongod;
let app;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test utilities
let testCount = 0;
let passedTests = 0;
let failedTests = 0;

function describe(name, fn) {
  console.log(`\n📋 ${name}`);
  fn();
}

function test(name, fn) {
  testCount++;
  try {
    const result = fn();
    if (result && typeof result.then === "function") {
      return result
        .then(() => {
          console.log(`  ✅ ${name}`);
          passedTests++;
        })
        .catch((error) => {
          console.log(`  ❌ ${name}: ${error.message}`);
          failedTests++;
        });
    } else {
      console.log(`  ✅ ${name}`);
      passedTests++;
    }
  } catch (error) {
    console.log(`  ❌ ${name}: ${error.message}`);
    failedTests++;
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(
            actual
          )}`
        );
      }
    },
    toBeDefined: () => {
      if (actual === undefined) {
        throw new Error("Expected value to be defined");
      }
    },
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    },
  };
}

// Setup database
async function setupDatabase() {
  try {
    mongod = await MongoMemoryServer.create({
      binary: {
        version: "6.0.0",
      },
    });
    const uri = mongod.getUri();

    // Close any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🗄️  Test database connected");
  } catch (error) {
    console.error("Database setup failed:", error);
    throw error;
  }
}

// Cleanup database
async function cleanupDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

// Teardown
async function teardown() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (mongod) {
      await mongod.stop();
    }
    console.log("🗄️  Test database disconnected");
  } catch (error) {
    console.error("Teardown failed:", error);
  }
}

// Run basic server tests
async function runServerTests() {
  describe("Server Basic Tests", () => {
    test("Server should start", async () => {
      // Import server setup
      const { configureExpress } = await import("../config/setup/express.js");
      app = configureExpress();
      expect(app).toBeDefined();
    });
  });
}

// Run registration tests
async function runRegistrationTests() {
  const { default: User } = await import("../models/user.model.js");
  const { default: Workspace } = await import("../models/workspace.model.js");

  describe("Registration Tests", () => {
    test("Should create default workspace when user registers", async () => {
      await cleanupDatabase();

      try {
        const response = await request(app).post("/api/auth/register").send({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.user).toBeDefined();
        expect(response.body.workspace).toBeDefined();
        expect(response.body.workspace.name).toBe("John Doe's Workspace");
        expect(response.body.workspace.role).toBe("owner");

        // Verify workspace exists in database
        const workspace = await Workspace.findById(response.body.workspace.id);
        expect(workspace).toBeDefined();
        expect(workspace.name).toBe("John Doe's Workspace");
        expect(workspace.members.length).toBe(1);
        expect(workspace.members[0].role).toBe("owner");
      } catch (error) {
        throw new Error(`Registration test failed: ${error.message}`);
      }
    });
  });
}

// Import and run workspace tests
async function runWorkspaceTests() {
  // Import models
  const { default: User } = await import("../models/user.model.js");
  const { default: Workspace } = await import("../models/workspace.model.js");

  describe("Workspace API Tests", () => {
    let authToken;
    let userId;
    let workspaceId;

    test("Should create a test user for workspace tests", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword123",
      });
      const savedUser = await user.save();
      userId = savedUser._id; // Keep as ObjectId, not string
      expect(savedUser).toBeDefined();
      expect(savedUser.email).toBe("test@example.com");
    });

    test("Should create a workspace", async () => {
      // Ensure userId is defined and valid
      if (!userId) {
        throw new Error("userId not set from previous test");
      }

      const workspace = new Workspace({
        name: "Test Workspace",
        description: "A test workspace",
        owner: userId,
      });
      const savedWorkspace = await workspace.save();
      workspaceId = savedWorkspace._id.toString();
      expect(savedWorkspace).toBeDefined();
      expect(savedWorkspace.name).toBe("Test Workspace");
      expect(savedWorkspace.owner.toString()).toBe(userId.toString());
      expect(savedWorkspace.members.length).toBe(1); // Owner should be auto-added
    });

    test("Should add member to workspace", async () => {
      const newUser = new User({
        name: "Member User",
        email: "member@example.com",
        password: "hashedPassword123",
      });
      const savedUser = await newUser.save();

      const workspace = await Workspace.findById(workspaceId);
      workspace.members.push({
        user: savedUser._id,
        role: "editor",
        joinedAt: new Date(),
      });
      await workspace.save();

      const updatedWorkspace = await Workspace.findById(workspaceId);
      expect(updatedWorkspace.members.length).toBe(2);
    });
  });
}

// Import and run document tests
async function runDocumentTests() {
  const { default: User } = await import("../models/user.model.js");
  const { default: Workspace } = await import("../models/workspace.model.js");
  const { default: Document } = await import("../models/document.model.js");

  describe("Document API Tests", () => {
    let userId;
    let workspaceId;
    let documentId;

    test("Should create test user and workspace for document tests", async () => {
      const user = new User({
        name: "Doc Test User",
        email: "doctest@example.com",
        password: "hashedPassword123",
      });
      const savedUser = await user.save();
      userId = savedUser._id.toString();

      const workspace = new Workspace({
        name: "Doc Test Workspace",
        description: "A test workspace for documents",
        owner: userId,
      });
      const savedWorkspace = await workspace.save();
      workspaceId = savedWorkspace._id.toString();

      expect(savedUser).toBeDefined();
      expect(savedWorkspace).toBeDefined();
    });

    test("Should create a document", async () => {
      const document = new Document({
        title: "Test Document",
        content: "This is test content",
        workspace: workspaceId,
        author: userId,
        type: "document",
      });
      const savedDocument = await document.save();
      documentId = savedDocument._id.toString();

      expect(savedDocument).toBeDefined();
      expect(savedDocument.title).toBe("Test Document");
      expect(savedDocument.workspace.toString()).toBe(workspaceId);
    });

    test("Should create nested document", async () => {
      const nestedDocument = new Document({
        title: "Nested Document",
        content: "This is nested content",
        workspace: workspaceId,
        author: userId,
        parent: documentId,
        type: "document",
      });
      const savedDocument = await nestedDocument.save();

      expect(savedDocument).toBeDefined();
      expect(savedDocument.parent.toString()).toBe(documentId);
    });

    test("Should add document to favorites", async () => {
      const document = await Document.findById(documentId);
      document.favorites.push(userId);
      await document.save();

      const updatedDocument = await Document.findById(documentId);
      expect(updatedDocument.favorites.length).toBe(1);
      expect(updatedDocument.favorites[0].toString()).toBe(userId);
    });

    test("Should search documents", async () => {
      const searchResults = await Document.find({
        workspace: workspaceId,
        title: { $regex: "test", $options: "i" },
      });

      expect(searchResults.length).toBe(2); // Should find both documents
    });
  });
}

// Run all tests
async function runTests() {
  console.log("🚀 Starting NovaDocs Test Suite\n");

  // Set environment to test
  process.env.NODE_ENV = "test";

  try {
    await setupDatabase();
    await runServerTests();
    await cleanupDatabase();
    await runRegistrationTests();
    await cleanupDatabase();
    await runWorkspaceTests();
    await cleanupDatabase();
    await runDocumentTests();

    console.log(`\n📊 Test Results:`);
    console.log(`   Total: ${testCount}`);
    console.log(`   Passed: ${passedTests}`);
    console.log(`   Failed: ${failedTests}`);

    if (failedTests > 0) {
      console.log("\n❌ Some tests failed");
      process.exit(1);
    } else {
      console.log("\n✅ All tests passed!");
      console.log(
        "\n🎉 Phase 2.0: Backend Workspace & Document APIs - COMPLETE!"
      );
    }
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    process.exit(1);
  } finally {
    await teardown();
  }
}

// Make functions global for test files
global.describe = describe;
global.test = test;
global.expect = expect;
global.setupDatabase = setupDatabase;
global.cleanupDatabase = cleanupDatabase;

runTests();
