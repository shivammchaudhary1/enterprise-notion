import React, { useState, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Typography,
  IconButton,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { useDocument } from "../../hooks/useDocument";
import { useWorkspace } from "../../hooks/useWorkspace";

const BreadcrumbNavigation = ({
  currentDocument,
  onNavigate,
  onToggleFavorite,
}) => {
  const theme = useTheme();
  const { getDocumentPath, toggleFavorite, isFavorite } = useDocument();
  const { currentWorkspace } = useWorkspace();

  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);

  const documentIsFavorite = currentDocument && isFavorite(currentDocument._id);

  useEffect(() => {
    const loadPath = async () => {
      if (!currentDocument) {
        setPath([]);
        return;
      }

      setLoading(true);
      try {
        const result = await getDocumentPath(currentDocument._id).unwrap();
        setPath(result.path || []);
      } catch (error) {
        console.error("Failed to load document path:", error);
        setPath([
          {
            _id: currentDocument._id,
            title: currentDocument.title,
            emoji: currentDocument.emoji,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPath();
  }, [currentDocument, getDocumentPath]);

  const handleBreadcrumbClick = (document) => {
    if (onNavigate) {
      onNavigate(document);
    }
  };

  const handleWorkspaceClick = () => {
    if (onNavigate) {
      onNavigate(null); // Navigate to workspace home
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentDocument || !onToggleFavorite) return;

    try {
      await toggleFavorite(currentDocument._id).unwrap();
      onToggleFavorite();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Loading path...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1,
        px: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Workspace Root */}
      <Chip
        icon={<HomeIcon />}
        label={currentWorkspace?.name || "Workspace"}
        onClick={handleWorkspaceClick}
        variant="outlined"
        size="small"
        sx={{
          cursor: "pointer",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      />

      {/* Document Path */}
      {path.length > 0 && (
        <>
          <ChevronRightIcon
            sx={{
              mx: 1,
              color: theme.palette.text.secondary,
              fontSize: 16,
            }}
          />
          <Breadcrumbs
            separator={<ChevronRightIcon fontSize="small" />}
            aria-label="document breadcrumb"
            sx={{ flex: 1 }}
          >
            {path.map((doc, index) => {
              const isLast = index === path.length - 1;
              const isClickable = !isLast && onNavigate;

              return (
                <Box
                  key={doc._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: isClickable ? "pointer" : "default",
                    "&:hover": isClickable
                      ? {
                          backgroundColor: theme.palette.action.hover,
                          borderRadius: 1,
                        }
                      : {},
                    px: isClickable ? 0.5 : 0,
                    py: 0.25,
                    borderRadius: 1,
                  }}
                  onClick={
                    isClickable ? () => handleBreadcrumbClick(doc) : undefined
                  }
                >
                  <Box sx={{ fontSize: "14px", mr: 0.5 }}>
                    {doc.emoji || "📄"}
                  </Box>
                  <Typography
                    variant="body2"
                    color={isLast ? "text.primary" : "text.secondary"}
                    sx={{
                      fontWeight: isLast ? 500 : 400,
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {doc.title || "Untitled"}
                  </Typography>
                </Box>
              );
            })}
          </Breadcrumbs>
        </>
      )}

      {/* Favorite Toggle */}
      {currentDocument && (
        <IconButton
          size="small"
          onClick={handleToggleFavorite}
          sx={{
            ml: 1,
            color: documentIsFavorite
              ? theme.palette.warning.main
              : theme.palette.text.secondary,
          }}
        >
          {documentIsFavorite ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      )}
    </Box>
  );
};

export default BreadcrumbNavigation;
