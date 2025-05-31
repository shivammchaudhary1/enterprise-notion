/**
 * Environment configuration for frontend
 * This file imports variables from .env and exports them
 */

// Environment variables are automatically loaded by Vite from .env files
// We can access them through import.meta.env
const config = {
  // Server URLs
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173",
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5001",

  // Environment
  NODE_ENV: import.meta.env.MODE || "development",

  // API version
  API_VERSION: import.meta.env.VITE_API_VERSION || "v1",

  // Debug mode
  DEBUG: import.meta.env.VITE_DEBUG === "true" || false,
};

export default config;
