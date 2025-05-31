// Express application setup and middleware configuration
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import config from "../environment/default.js";
import allRoutes from "../../routes/app.routes.js";

/**
 * Configure Express application with all middleware
 * @returns {express.Application} - Configured Express application
 */
export const configureExpress = () => {
  // Create Express app
  const app = express();

  // Get current file and directory paths (ES module compatible)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Security middleware
  app.use(helmet()); // Set various HTTP headers for security
  app.use(cors()); // Enable Cross-Origin Resource Sharing

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimitWindow * 60 * 1000, // Convert minutes to milliseconds
    max: config.rateLimitMax, // Limit each IP to max requests per windowMs
    message: "Too many requests from this IP, please try again later",
  });
  app.use("/api", limiter); // Apply rate limiting to API routes

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Compression middleware (reduces response size)
  app.use(compression());

  // Logging middleware in development
  if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
  }

  // Mount all API routes
  allRoutes(app);

  // Root endpoint to check if server is running
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running smoothly",
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    });
  });

  // Catch-all route for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.originalUrl}`,
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(chalk.red(`Error: ${err.message}`));
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server Error",
      stack: config.nodeEnv === "development" ? err.stack : undefined,
    });
  });

  return app;
};
