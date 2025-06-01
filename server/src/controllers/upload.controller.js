import multer from "multer";
import path from "path";
import fs from "fs";
import { errorMessage, successMessage } from "../utils/response.js";

// Ensure upload directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const workspaceId = req.params.workspaceId || req.body.workspaceId;
    const workspaceDir = path.join(uploadDir, workspaceId);

    // Create workspace-specific directory
    if (!fs.existsSync(workspaceDir)) {
      fs.mkdirSync(workspaceDir, { recursive: true });
    }

    cb(null, workspaceDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files at once
  },
});

// Upload single file
export const uploadSingle = upload.single("file");

// Upload multiple files
export const uploadMultiple = upload.array("files", 5);

// Upload file controller
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorMessage("No file uploaded"));
    }

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.params.workspaceId}/${req.file.filename}`,
    };

    return res
      .status(200)
      .json(successMessage("File uploaded successfully", { file: fileData }));
  } catch (error) {
    console.error("Upload file error:", error);
    return res.status(500).json(errorMessage("Failed to upload file"));
  }
};

// Upload multiple files controller
export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json(errorMessage("No files uploaded"));
    }

    const filesData = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${req.params.workspaceId}/${file.filename}`,
    }));

    return res
      .status(200)
      .json(
        successMessage("Files uploaded successfully", { files: filesData })
      );
  } catch (error) {
    console.error("Upload files error:", error);
    return res.status(500).json(errorMessage("Failed to upload files"));
  }
};

// Delete file controller
export const deleteFile = async (req, res) => {
  try {
    const { workspaceId, filename } = req.params;
    const filePath = path.join(uploadDir, workspaceId, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json(errorMessage("File not found"));
    }

    // Delete file
    fs.unlinkSync(filePath);

    return res.status(200).json(successMessage("File deleted successfully"));
  } catch (error) {
    console.error("Delete file error:", error);
    return res.status(500).json(errorMessage("Failed to delete file"));
  }
};

// Get file controller (for serving files)
export const getFile = async (req, res) => {
  try {
    const { workspaceId, filename } = req.params;
    const filePath = path.join(uploadDir, workspaceId, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json(errorMessage("File not found"));
    }

    // Send file
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error("Get file error:", error);
    return res.status(500).json(errorMessage("Failed to retrieve file"));
  }
};

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json(errorMessage("File too large (max 10MB)"));
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json(errorMessage("Too many files (max 5)"));
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json(errorMessage("Unexpected file field"));
    }
  }

  if (error.message === "File type not allowed") {
    return res.status(400).json(errorMessage("File type not allowed"));
  }

  return res.status(500).json(errorMessage("Upload error"));
};
