// Server setup and initialization
import chalk from "chalk";
import connectDB from "../db/db.js";
import config from "../environment/default.js";

/**
 * Initialize the server with database connection
 * @param {Express.Application} app - Express application
 * @returns {http.Server} - HTTP server instance
 */
export const initializeServer = async (app) => {
  // Start server
  const server = app.listen(config.port, async () => {
    console.log(
      chalk.blue.bold(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      )
    );

    // Connect to MongoDB
    await connectDB();
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.error(chalk.red(`Error: ${err.message}`));
    // Close server & exit process
    server.close(() => process.exit(1));
  });

  return server;
};
