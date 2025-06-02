import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Description as DocumentIcon,
  History as RecentIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useDocument } from "../../hooks/useDocument";
import { useWorkspace } from "../../hooks/useWorkspace";
import { debounce } from "../../lib/utils";

const SearchInterface = ({ onDocumentSelect, onClose }) => {
  const theme = useTheme();
  const { searchDocuments, recentDocuments, loading } = useDocument();
  const { currentWorkspace } = useWorkspace();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim() || !currentWorkspace) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const results = await searchDocuments({
          workspaceId: currentWorkspace._id,
          query: searchQuery,
          limit: 10,
        });

        setSearchResults(results.documents || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    }, 300),
    [currentWorkspace, searchDocuments]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleDocumentClick = (document) => {
    // Save to recent searches
    const newRecentSearches = [
      { query, documentId: document._id, documentTitle: document.title },
      ...recentSearches.filter((item) => item.documentId !== document._id),
    ].slice(0, 5);

    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

    onDocumentSelect(document);
    if (onClose) onClose();
  };

  const handleRecentSearchClick = (recentSearch) => {
    setQuery(recentSearch.query);
  };

  const renderSearchResults = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (!showResults && !query) {
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Recent Searches
          </Typography>
          {recentSearches.length > 0 ? (
            <List dense>
              {recentSearches.map((item, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleRecentSearchClick(item)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon>
                    <RecentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.query}
                    secondary={item.documentTitle}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No recent searches
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Recent Documents
          </Typography>
          {recentDocuments?.length > 0 ? (
            <List dense>
              {recentDocuments.slice(0, 5).map((doc) => (
                <ListItem
                  key={doc._id}
                  button
                  onClick={() => handleDocumentClick(doc)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon>
                    <Box sx={{ fontSize: "16px" }}>{doc.emoji || "📄"}</Box>
                  </ListItemIcon>
                  <ListItemText primary={doc.title} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No recent documents
            </Typography>
          )}
        </Box>
      );
    }

    if (searchResults.length === 0 && query) {
      return (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No results found for "{query}"
          </Typography>
        </Box>
      );
    }

    return (
      <List dense>
        {searchResults.map((doc) => (
          <ListItem
            key={doc._id}
            button
            onClick={() => handleDocumentClick(doc)}
            sx={{
              borderRadius: 1,
              mx: 1,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon>
              <Box sx={{ fontSize: "16px" }}>{doc.emoji || "📄"}</Box>
            </ListItemIcon>
            <ListItemText
              primary={doc.title}
              secondary={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  {doc.metadata?.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "10px", height: 20 }}
                    />
                  ))}
                  {doc.isFavorited && (
                    <StarIcon
                      sx={{ fontSize: 14, color: theme.palette.warning.main }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1000,
        maxHeight: 400,
        overflow: "auto",
        mt: 1,
      }}
    >
      <Box sx={{ p: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search documents..."
          value={query}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 300, overflow: "auto" }}>
        {renderSearchResults()}
      </Box>
    </Paper>
  );
};

export default SearchInterface;
