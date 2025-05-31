/**
 * JWT utility functions for token creation and verification
 */
import jwt from "jsonwebtoken";
import config from "../environment/default.js";

/**
 * Create a JWT token for a user
 * @param {Object} payload - Data to encode in the token (typically user ID and role)
 * @param {Object} [options] - JWT options
 * @param {string} [options.expiresIn] - Token expiration time (e.g., '30d', '2h', '7d')
 * @returns {string} - JWT token
 */
export const createJWT = (payload, options = {}) => {
  try {
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: options.expiresIn || config.jwtExpire,
    });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw new Error("Token creation failed");
  }
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded payload if token is valid
 * @throws {Error} - If token is invalid or expired
 */
export const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw new Error("Invalid token");
  }
};

/**
 * Extract JWT token from authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - JWT token or null if not found/invalid
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};
