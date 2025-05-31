/**
 * Bcrypt utility functions for password hashing and comparison
 */
import bcrypt from "bcrypt";

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password to encrypt
 * @param {number} [saltRounds=10] - Number of salt rounds for bcrypt (higher is more secure but slower)
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password encryption failed");
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password to compare
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};
