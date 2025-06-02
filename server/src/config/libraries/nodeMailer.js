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

/**
 * Send workspace invitation email
 * @param {string} email - Recipient email
 * @param {string} workspaceName - Name of the workspace
 * @param {string} inviterName - Name of the person sending the invitation
 * @param {string} role - Role being offered
 * @param {string} invitationToken - Invitation token for acceptance
 * @returns {Promise} - Promise that resolves to email sending result
 */
export const sendWorkspaceInvitationEmail = async (
  email,
  workspaceName,
  inviterName,
  role,
  invitationToken
) => {
  const invitationUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/join/${invitationToken}`;

  const roleDescriptions = {
    admin: "manage members and workspace settings",
    editor: "view, comment, and edit documents",
    viewer: "view and comment on documents",
  };

  const roleDescription = roleDescriptions[role] || "collaborate";

  const mailOptions = {
    to: email,
    subject: `${inviterName} invited you to join ${workspaceName} on Enterprise Notion`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; font-size: 28px; margin: 0;">📝 Enterprise Notion</h1>
          </div>
          
          <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">You're invited to join a workspace!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 10px 0; font-size: 20px;">🏠 ${workspaceName}</h3>
            <p style="color: #666; margin: 0; font-size: 16px;">
              <strong>${inviterName}</strong> has invited you to join this workspace as a <strong>${role}</strong>.
            </p>
          </div>

          <div style="margin-bottom: 25px;">
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              As a <strong>${role}</strong>, you'll be able to ${roleDescription} in this workspace.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" 
               style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">
              Join Workspace
            </a>
          </div>

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⏰ Important:</strong> This invitation will expire in 7 days. Make sure to accept it soon!
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 25px 0;">

          <div style="color: #6c757d; font-size: 14px;">
            <p><strong>What is Enterprise Notion?</strong></p>
            <p style="margin: 10px 0;">
              Enterprise Notion is a collaborative workspace where teams can create, share, and organize documents, 
              ideas, and projects in one place. It's perfect for team collaboration and knowledge management.
            </p>
            
            <p style="margin-top: 20px;">
              If you don't have an account yet, you'll be able to create one after clicking the invitation link.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 25px 0;">

          <p style="color: #6c757d; font-size: 12px; text-align: center; margin: 0;">
            If you didn't expect this invitation, you can safely ignore this email.<br>
            If the button doesn't work, copy and paste this link: <a href="${invitationUrl}" style="color: #007bff;">${invitationUrl}</a>
          </p>
        </div>
      </div>
    `,
    text: `
You're invited to join ${workspaceName} on Enterprise Notion!

${inviterName} has invited you to join the "${workspaceName}" workspace as a ${role}.

As a ${role}, you'll be able to ${roleDescription}.

Click this link to accept the invitation:
${invitationUrl}

Important: This invitation will expire in 7 days.

If you don't have an account yet, you'll be able to create one after clicking the invitation link.

If you didn't expect this invitation, you can safely ignore this email.

Enterprise Notion - Collaborative Workspace Platform
    `,
  };

  return await sendMail(mailOptions);
};

/**
 * Send account credentials email to new users created from invitation
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} password - Generated password
 * @param {string} workspaceName - Name of the workspace they were invited to
 * @returns {Promise} - Promise that resolves to email sending result
 */
export const sendAccountCredentialsEmail = async (
  email,
  name,
  password,
  workspaceName
) => {
  const loginUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/login`;

  const mailOptions = {
    to: email,
    subject: "Your Enterprise Notion Account - Login Credentials",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #007bff; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
              EN
            </div>
            <h1 style="color: #333; margin: 0; font-size: 28px;">Welcome to Enterprise Notion!</h1>
          </div>

          <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #1565c0; margin-top: 0;">🎉 Your account has been created!</h3>
            <p style="color: #333; margin-bottom: 0;">
              Hello <strong>${name}</strong>, you've been invited to join <strong>${workspaceName}</strong> workspace on Enterprise Notion. 
              We've created an account for you with the following credentials:
            </p>
          </div>

          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #ddd;">
            <h3 style="color: #333; margin-top: 0; display: flex; align-items: center;">
              🔐 Your Login Credentials
            </h3>
            <div style="margin: 15px 0;">
              <strong style="color: #555;">Email:</strong> 
              <span style="background-color: #e8f5e8; padding: 8px 12px; border-radius: 4px; font-family: monospace; margin-left: 10px;">${email}</span>
            </div>
            <div style="margin: 15px 0;">
              <strong style="color: #555;">Password:</strong> 
              <span style="background-color: #fff3cd; padding: 8px 12px; border-radius: 4px; font-family: monospace; margin-left: 10px; border: 1px solid #ffeaa7;">${password}</span>
            </div>
          </div>

          <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="color: #f57c00; margin-top: 0;">🔒 Security Recommendation</h4>
            <p style="color: #333; margin-bottom: 0; font-size: 14px;">
              For your security, we strongly recommend changing your password after your first login. 
              You can do this by going to your profile settings.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; transition: background-color 0.3s;">
              🚀 Login to Your Account
            </a>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 10px 0;">
              Questions? Need help? Contact our support team.
            </p>
            <p style="color: #888; font-size: 12px; margin: 5px 0;">
              This email was sent because you were invited to join a workspace on Enterprise Notion.
            </p>
          </div>
        </div>
      </div>
    `,
    text: `Welcome to Enterprise Notion!

Hello ${name},

You've been invited to join "${workspaceName}" workspace on Enterprise Notion. We've created an account for you with the following credentials:

Email: ${email}
Password: ${password}

IMPORTANT: For your security, please change your password after your first login.

Login here: ${loginUrl}

Questions? Contact our support team.
`,
  };

  try {
    const result = await sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending credentials email:", error);
    throw error;
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
