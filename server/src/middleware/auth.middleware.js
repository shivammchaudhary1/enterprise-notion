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
