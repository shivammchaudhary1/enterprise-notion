// Environment variable configuration
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Export environment variables with defaults
export default {
  // Server configuration
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  backendUrl: process.env.BACKEND_URL,

  // MongoDB configuration
  mongoUri: process.env.MONGO_URI,

  // Security configuration
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret_key_here",
  jwtExpire: process.env.JWT_EXPIRE || "30d",

  // Rate limiting configuration
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15, // minutes
  rateLimitMax: process.env.RATE_LIMIT_MAX || 1000, // requests

  //NodeMailer configuration
  nodeMailerService: process.env.NODEMAILER_SERVICE || "gmail",
  nodeMailerUser: process.env.NODEMAILER_USER || "shivamchaudhary75@gmail.com",
  nodeMailerPass: process.env.NODEMAILER_PASS || "yonbttfzjplasrsc",
  nodeMailerHost: process.env.NODEMAILER_HOST || "smtp.gmail.com",
  nodeMailerPort: process.env.NODEMAILER_PORT || 465,

  // GOOGLE OAUTH configuration
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  // Google API configuration
  geminiApiKey: process.env.GEMINI_API_KEY || "your-gemini-api-key-here",
};
