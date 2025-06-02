/**
 * Main server entry point
 *
 * This file is the main entry point for the server application.
 * It imports the necessary configurations and starts the server.
 */
import { configureExpress } from "./src/config/setup/express.js";
import { initializeServer } from "./src/config/setup/setup.js";
import passport from "./src/config/libraries/passport.js";

// Get the configured Express application
const app = configureExpress();

// Initialize Passport
import session from "express-session";

// Add session support
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Initialize and start the server
const server = await initializeServer(app);

export default server;
