import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Collapse,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  MoreHoriz as MoreHorizIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
} from "@mui/icons-material";
import { useDocument } from "../../hooks/useDocument";
import { useWorkspace } from "../../hooks/useWorkspace";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const DocumentTreeItem = ({
  document,
  level = 0,
  onDocumentSelect,
  selectedDocumentId,
}) => {
  const theme = useTheme();
  const {
    documentTree,
    createDocument,
    deleteDocument,
    toggleFavorite,
    isFavorite,
  } = useDocument();
  const { currentWorkspace } = useWorkspace();

  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const hasChildren = document.children && document.children.length > 0;
  const isSelected = selectedDocumentId === document._id;
  const documentIsFavorite = isFavorite(document._id);

  const handleExpand = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDocumentClick = () => {
    onDocumentSelect(document);
  };

  const handleAddSubPage = async () => {
    if (!currentWorkspace) return;

    setIsCreating(true);
    try {
      const newDoc = await createDocument({
        title: "Untitled",
        workspace: currentWorkspace._id,
        parent: document._id,
        position: hasChildren ? document.children.length : 0,
      }).unwrap();

      setExpanded(true);
      onDocumentSelect(newDoc);
      toast.success("Sub-page created successfully!");
    } catch (error) {
      toast.error("Failed to create sub-page");
    } finally {
      setIsCreating(false);
    }
    handleMenuClose();
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(document._id).unwrap();
      toast.success(
        documentIsFavorite ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorites");
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete "${document.title}"?`)
    ) {
      try {
        await deleteDocument(document._id).unwrap();
        toast.success("Document deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete document");
      }
    }
    handleMenuClose();
  };

  return (
    <Box>
      <ListItem
        onClick={handleDocumentClick}
        sx={{
          py: 0.25,
          px: 1,
          pl: 1 + level * 1.5,
          borderRadius: 1,
          cursor: "pointer",
          backgroundColor: isSelected
            ? theme.palette.action.selected
            : "transparent",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            "& .document-actions": {
              visibility: "visible",
            },
          },
          minHeight: 28,
        }}
      >
        {/* Expand/Collapse Icon */}
        <Box sx={{ width: 20, display: "flex", justifyContent: "center" }}>
          {hasChildren && (
            <IconButton
              size="small"
              onClick={handleExpand}
              sx={{
                p: 0.5,
                color: theme.palette.text.secondary,
              }}
            >
              {expanded ? (
                <ExpandMoreIcon fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>

        {/* Document Icon */}
        <Box sx={{ mr: 1, fontSize: "14px", minWidth: 20 }}>
          {document.emoji || "📄"}
        </Box>

        {/* Document Title */}
        <ListItemText
          primary={document.title || "Untitled"}
          sx={{
            "& .MuiListItemText-primary": {
              fontSize: "14px",
              fontWeight: isSelected ? 500 : 400,
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
        />

        {/* Favorite Icon */}
        {documentIsFavorite && (
          <StarIcon
            sx={{
              fontSize: 16,
              color: theme.palette.warning.main,
              mr: 0.5,
            }}
          />
        )}

        {/* Actions Menu */}
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          className="document-actions"
          sx={{
            visibility: "hidden",
            p: 0.5,
            color: theme.palette.text.secondary,
          }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </ListItem>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleAddSubPage} disabled={isCreating}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add sub-page" />
        </MenuItem>

        <MenuItem onClick={handleToggleFavorite}>
          <ListItemIcon>
            {documentIsFavorite ? (
              <StarBorderIcon fontSize="small" />
            ) : (
              <StarIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              documentIsFavorite ? "Remove from favorites" : "Add to favorites"
            }
          />
        </MenuItem>

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Duplicate" />
        </MenuItem>

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      {/* Children */}
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {document.children.map((child) => (
              <DocumentTreeItem
                key={child._id}
                document={child}
                level={level + 1}
                onDocumentSelect={onDocumentSelect}
                selectedDocumentId={selectedDocumentId}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

const DocumentTree = ({
  documents = [],
  onDocumentSelect,
  selectedDocumentId,
}) => {
  const theme = useTheme();

  if (!documents || documents.length === 0) {
    return (
      <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No documents yet
        </Typography>
      </Box>
    );
  }

  return (
    <List component="nav" disablePadding sx={{ width: "100%" }}>
      {documents.map((document) => (
        <DocumentTreeItem
          key={document._id}
          document={document}
          onDocumentSelect={onDocumentSelect}
          selectedDocumentId={selectedDocumentId}
        />
      ))}
    </List>
  );
};

export default DocumentTree;
