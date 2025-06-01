import nodemailer from "nodemailer";
import config from "../environment/default.js";

// Create transporter with Gmail configuration
const transporter = nodemailer.createTransport({
  service: config.nodeMailerService,
  host: config.nodeMailerHost,
  port: config.nodeMailerPort,
  secure: config.nodeMailerPort === 465, // true for 465, false for other ports
  auth: {
    user: config.nodeMailerUser,
    pass: config.nodeMailerPass,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer configuration error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

/**
 * General function to send emails
 * @param {Object} mailOptions - Email configuration object
 * @param {string} mailOptions.to - Recipient email address
 * @param {string} mailOptions.subject - Email subject
 * @param {string} mailOptions.text - Plain text content (optional)
 * @param {string} mailOptions.html - HTML content (optional)
 * @param {string} mailOptions.from - Sender email (optional, defaults to config)
 * @param {Array} mailOptions.attachments - File attachments (optional)
 * @returns {Promise} - Promise that resolves to email sending result
 */
export const sendMail = async (mailOptions) => {
  try {
    // Validate required fields
    if (!mailOptions.to) {
      throw new Error("Recipient email address is required");
    }
    if (!mailOptions.subject) {
      throw new Error("Email subject is required");
    }
    if (!mailOptions.text && !mailOptions.html) {
      throw new Error("Email content (text or html) is required");
    }

    // Prepare mail options with defaults
    const mailConfig = {
      from:
        mailOptions.from || `"Enterprise Notion" <${config.nodeMailerUser}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      attachments: mailOptions.attachments || [],
    };

    // Send email
    const result = await transporter.sendMail(mailConfig);
    console.log("Email sent successfully:", result.messageId);
    return {
      success: true,
      messageId: result.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to send email",
    };
  }
};

/**
 * Send welcome email to new users
 * @param {string} email - User email
 * @param {string} name - User name
 * @returns {Promise} - Promise that resolves to email sending result
 */
export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    to: email,
    subject: "Welcome to Enterprise Notion!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Enterprise Notion!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for joining Enterprise Notion. We're excited to have you on board!</p>
        <p>You can now start organizing your work and collaborating with your team.</p>
        <div style="margin: 20px 0;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Get Started
          </a>
        </div>
        <p>Best regards,<br>The Enterprise Notion Team</p>
      </div>
    `,
  };

  return await sendMail(mailOptions);
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetToken - Password reset token
 * @param {string} name - User name
 * @returns {Promise} - Promise that resolves to email sending result
 */
export const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/reset-password/${resetToken}`;

  const mailOptions = {
    to: email,
    subject: "Password Reset Request - Enterprise Notion",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>You requested a password reset for your Enterprise Notion account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        </p>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Enterprise Notion - Secure Document Management
        </p>
      </div>
    `,
    text: `
Password Reset Request

Hello ${name},

You requested a password reset for your Enterprise Notion account.

Click this link to reset your password: ${resetUrl}

Important: This link will expire in 10 minutes for security reasons.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Enterprise Notion
    `,
  };

  return await sendMail(mailOptions);
};

/**
 * Send email verification email
 * @param {string} email - User email
 * @param {string} verificationToken - Email verification token
 * @param {string} name - User name
 * @returns {Promise} - Promise that resolves to email sending result
 */
export const sendEmailVerification = async (email, verificationToken, name) => {
  const verificationUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/verify-email?token=${verificationToken}`;

  const mailOptions = {
    to: email,
    subject: "Verify Your Email - Enterprise Notion",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Hello ${name},</p>
        <p>Please verify your email address to complete your Enterprise Notion account setup.</p>
        <div style="margin: 20px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </div>
        <p>If you didn't create this account, please ignore this email.</p>
        <p>Best regards,<br>The Enterprise Notion Team</p>
      </div>
    `,
  };

  return await sendMail(mailOptions);
};

/**
 * Simple function to send basic emails quickly
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} message - Email message (can be HTML or plain text)
 * @param {boolean} isHtml - Whether the message is HTML (default: false)
 * @returns {Promise} - Promise that resolves to email sending result
 */
export const sendSimpleEmail = async (to, subject, message, isHtml = false) => {
  try {
    const mailOptions = {
      to,
      subject,
      [isHtml ? "html" : "text"]: message,
    };

    return await sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending simple email:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to send simple email",
    };
  }
};

export default transporter;

/*
 * USAGE EXAMPLES:
 *
 * 1. Basic text email:
 * import { sendSimpleEmail } from './config/libraries/nodeMailer.js';
 *
 * await sendSimpleEmail(
 *   'user@example.com',
 *   'Hello from Enterprise Notion',
 *   'This is a simple text message!'
 * );
 *
 * 2. HTML email:
 * await sendSimpleEmail(
 *   'user@example.com',
 *   'HTML Email',
 *   '<h1>Hello!</h1><p>This is an HTML email.</p>',
 *   true
 * );
 *
 * 3. Notification email:
 * await sendSimpleEmail(
 *   'admin@company.com',
 *   'New User Registration',
 *   'A new user has registered on the platform.'
 * );
 *
 * 4. Multiple recipients (comma-separated):
 * await sendSimpleEmail(
 *   'user1@example.com, user2@example.com',
 *   'Team Update',
 *   'Important team announcement here.'
 * );
 *
 * 5. With error handling:
 * const result = await sendSimpleEmail(
 *   'user@example.com',
 *   'Test Email',
 *   'Test message'
 * );
 *
 * if (result.success) {
 *   console.log('Email sent successfully!');
 * } else {
 *   console.error('Failed to send email:', result.error);
 * }
 */

// sendSimpleEmail(to, subject, message, isHtml = false)
