import { verifyJWT, extractTokenFromHeader } from "../config/libraries/jwt.js";

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      // Verify token
      const decoded = verifyJWT(token);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.message === "Token has expired") {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please login again.",
          isExpired: true,
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error authenticating user",
    });
  }
};

/**
 * Middleware for optional authentication
 * Sets req.user if token is valid, but doesn't fail if no token provided
 */
export const optionalAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided - continue without authentication
      req.user = null;
      return next();
    }

    try {
      // Verify token
      const decoded = verifyJWT(token);
      req.user = decoded;
      next();
    } catch (error) {
      // Invalid token - continue without authentication but log the error
      console.warn("Invalid token provided in optional auth:", error.message);
      req.user = null;
      next();
    }
  } catch (error) {
    // Error in middleware - continue without authentication
    console.error("Error in optional auth middleware:", error);
    req.user = null;
    next();
  }
};
