import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import Workspace from "./src/models/workspace.model.js";

async function debugTest() {
  let mongod;

  try {
    console.log("🚀 Starting debug test...");

    // Setup database
    mongod = await MongoMemoryServer.create({
      binary: { version: "6.0.0" },
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log("✅ Database connected");

    // Test user creation
    console.log("Creating user...");
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    console.log("✅ User created:", user._id);

    // Test workspace creation
    console.log("Creating workspace...");
    const workspace = await Workspace.create({
      name: `${user.name}'s Workspace`,
      description: "Test workspace",
      owner: user._id,
      emoji: "🏠",
      settings: {
        isPublic: false,
        allowMemberInvites: true,
        defaultPermission: "viewer",
      },
    });
    console.log("✅ Workspace created:", workspace._id);
    console.log("✅ Members:", workspace.members);

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("Stack:", error.stack);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (mongod) {
      await mongod.stop();
    }
  }
}

debugTest();
