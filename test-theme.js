// Test script to check theme preferences functionality
const axios = require("axios");

const API_BASE = "http://localhost:4567/api";

async function testThemePreferences() {
  let token = null;

  try {
    console.log("🔹 Step 1: Registering a new user...");

    // Wait to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      name: "Theme Test User",
      email: `themetest${Date.now()}@example.com`,
      password: "TestPassword123!",
    });

    token = registerResponse.data.token;
    console.log("✅ User registered successfully");
    console.log("Token:", token.substring(0, 20) + "...");

    console.log("\n🔹 Step 2: Getting initial user preferences...");
    const prefsResponse = await axios.get(`${API_BASE}/user/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Initial preferences:", prefsResponse.data.data);

    console.log("\n🔹 Step 3: Updating theme to dark...");
    const updateResponse = await axios.put(
      `${API_BASE}/user/preferences`,
      {
        theme: "dark",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Theme updated:", updateResponse.data.data.preferences);

    console.log("\n🔹 Step 4: Verifying theme was saved...");
    const verifyResponse = await axios.get(`${API_BASE}/user/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Verified preferences:", verifyResponse.data.data);

    console.log("\n🔹 Step 5: Updating theme to system...");
    const systemResponse = await axios.put(
      `${API_BASE}/user/preferences`,
      {
        theme: "system",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ System theme set:", systemResponse.data.data.preferences);

    console.log("\n🎉 All theme preference tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testThemePreferences();
