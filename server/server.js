/**
 * Main server entry point
 *
 * This file is the main entry point for the server application.
 * It imports the necessary configurations and starts the server.
 */
import { configureExpress } from "./src/config/setup/express.js";
import { initializeServer } from "./src/config/setup/setup.js";

// Get the configured Express application
const app = configureExpress();

// Initialize and start the server
const server = await initializeServer(app);

export default server;
