import React, { useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  TableChart,
  CheckBox,
  Title,
} from "@mui/icons-material";
import FileUpload from "./FileUpload";

const EditorToolbar = ({ editor, readOnly, document }) => {
  const theme = useTheme();
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [headingMenuAnchor, setHeadingMenuAnchor] = useState(null);

  if (!editor || readOnly) {
    return null;
  }

  const handleLinkSubmit = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setLinkUrl("");
    setLinkDialogOpen(false);
  };

  const handleYoutubeSubmit = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 640,
        height: 480,
      });
    }
    setYoutubeUrl("");
    setYoutubeDialogOpen(false);
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      editor.chain().focus().setImage({ src: e.target.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleHeadingSelect = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
    setHeadingMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      {/* Headings */}
      <Tooltip title="Heading">
        <IconButton
          onClick={(e) => setHeadingMenuAnchor(e.currentTarget)}
          color={editor.isActive("heading") ? "primary" : "default"}
        >
          <Title />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={headingMenuAnchor}
        open={Boolean(headingMenuAnchor)}
        onClose={() => setHeadingMenuAnchor(null)}
      >
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <MenuItem
            key={level}
            onClick={() => handleHeadingSelect(level)}
            selected={editor.isActive("heading", { level })}
          >
            H{level}
          </MenuItem>
        ))}
      </Menu>

      <Divider orientation="vertical" flexItem />

      {/* Basic Formatting */}
      <Tooltip title="Bold">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive("bold") ? "primary" : "default"}
        >
          <FormatBold />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive("italic") ? "primary" : "default"}
        >
          <FormatItalic />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          color={editor.isActive("underline") ? "primary" : "default"}
        >
          <FormatUnderlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Strike">
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          color={editor.isActive("strike") ? "primary" : "default"}
        >
          <FormatStrikethrough />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Lists */}
      <Tooltip title="Bullet List">
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive("bulletList") ? "primary" : "default"}
        >
          <FormatListBulleted />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered List">
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive("orderedList") ? "primary" : "default"}
        >
          <FormatListNumbered />
        </IconButton>
      </Tooltip>
      <Tooltip title="Task List">
        <IconButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          color={editor.isActive("taskList") ? "primary" : "default"}
        >
          <CheckBox />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Code */}
      <Tooltip title="Code Block">
        <IconButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          color={editor.isActive("codeBlock") ? "primary" : "default"}
        >
          <Code />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Links and Media */}
      <Tooltip title="Link">
        <IconButton onClick={() => setLinkDialogOpen(true)}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Image">
        <IconButton component="label">
          <ImageIcon />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.length) {
                handleImageUpload(e.target.files[0]);
              }
            }}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="YouTube">
        <IconButton onClick={() => setYoutubeDialogOpen(true)}>
          <YouTubeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Table">
        <IconButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <TableChart />
        </IconButton>
      </Tooltip>

      {/* File Upload */}
      <FileUpload
        documentId={document?._id}
        workspaceId={document?.workspace}
        onFileUploaded={(file) => {
          // Insert file link in editor
          editor
            .chain()
            .focus()
            .setLink({ href: file.url, target: "_blank" })
            .insertContent(file.name)
            .run();
        }}
        compact
      />

      {/* Link Dialog */}
      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLinkSubmit} variant="contained">
            Insert
          </Button>
        </DialogActions>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog
        open={youtubeDialogOpen}
        onClose={() => setYoutubeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Insert YouTube Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="YouTube URL"
            type="url"
            fullWidth
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setYoutubeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleYoutubeSubmit} variant="contained">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditorToolbar;
