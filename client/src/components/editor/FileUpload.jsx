import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
} from "@mui/icons-material";
import { useDocument } from "../../hooks/useDocument";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const FileUpload = ({
  documentId,
  workspaceId,
  onFileUploaded,
  compact = false,
}) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const { uploadFile, uploadLoading } = useDocument();

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
    "application/json",
  ];

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <ImageIcon />;
    if (fileType === "application/pdf") return <PdfIcon />;
    if (fileType.includes("document") || fileType.includes("word"))
      return <DocIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      showErrorToast(`File size exceeds ${formatFileSize(maxFileSize)} limit`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      showErrorToast("File type not supported");
      return false;
    }

    return true;
  };

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (files) => {
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentId", documentId);
        formData.append("workspaceId", workspaceId);

        const response = await uploadFile(formData);

        const uploadedFile = {
          id: response.file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: response.file.url,
          uploadedAt: new Date().toISOString(),
        };

        setUploadedFiles((prev) => [...prev, uploadedFile]);

        if (onFileUploaded) {
          onFileUploaded(uploadedFile);
        }

        setUploadProgress(((i + 1) / files.length) * 100);
        showSuccessToast(`${file.name} uploaded successfully`);
      } catch (error) {
        showErrorToast(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    setTimeout(() => setUploadProgress(0), 2000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  const handleButtonClick = () => {
    if (compact) {
      setShowDialog(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  if (compact) {
    return (
      <>
        <IconButton
          onClick={handleButtonClick}
          disabled={uploadLoading}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
          title="Upload file"
        >
          <AttachFileIcon fontSize="small" />
        </IconButton>

        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              Upload Files
              <IconButton onClick={() => setShowDialog(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <FileUpload
              documentId={documentId}
              workspaceId={workspaceId}
              onFileUploaded={(file) => {
                onFileUploaded?.(file);
                setShowDialog(false);
              }}
              compact={false}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Upload Progress */}
      {uploadProgress > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Uploading... {Math.round(uploadProgress)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      )}

      {/* Drop Zone */}
      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: `2px dashed ${
            dragActive ? theme.palette.primary.main : theme.palette.divider
          }`,
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          backgroundColor: dragActive
            ? theme.palette.action.hover
            : theme.palette.background.paper,
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUploadIcon
          sx={{
            fontSize: 48,
            color: dragActive
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            mb: 2,
          }}
        />

        <Typography
          variant="h6"
          sx={{ mb: 1, color: theme.palette.text.primary }}
        >
          {dragActive ? "Drop files here" : "Upload files"}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Drag and drop files here, or click to browse
        </Typography>

        <Button
          variant="contained"
          startIcon={<AttachFileIcon />}
          disabled={uploadLoading}
          sx={{ textTransform: "none" }}
        >
          Choose Files
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block" }}
        >
          Supported: Images, PDFs, Documents (Max {formatFileSize(maxFileSize)})
        </Typography>
      </Box>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(",")}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />

      {/* Upload Restrictions */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Upload Guidelines:</strong>
          <br />• Maximum file size: {formatFileSize(maxFileSize)}
          <br />
          • Supported formats: Images, PDFs, Documents, Spreadsheets
          <br />• Files will be attached to this document
        </Typography>
      </Alert>

      {/* Recently Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Recently Uploaded
          </Typography>
          {uploadedFiles.map((file) => (
            <Chip
              key={file.id}
              icon={getFileIcon(file.type)}
              label={`${file.name} (${formatFileSize(file.size)})`}
              onDelete={() => handleRemoveFile(file.id)}
              sx={{ mr: 1, mb: 1 }}
              clickable
              onClick={() => window.open(file.url, "_blank")}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
