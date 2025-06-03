import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { common, createLowlight } from "lowlight";
import { useDocument } from "../../hooks/useDocument";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import {
  Box,
  Paper,
  Popper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import {
  Title as TitleIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
  Code as CodeIcon,
  CheckBox as TaskListIcon,
  TableChart as TableIcon,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  Link as LinkIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  AttachFile,
  Description,
} from "@mui/icons-material";
import FileUpload from "./FileUpload";
import MeetingNotesModal from "./MeetingNotesModal";

// Initialize lowlight with common languages
const lowlight = createLowlight(common);

const SlashCommandList = ({ items, anchorEl, onSelect }) => {
  if (!anchorEl) return null;

  return (
    <Popper
      open={true}
      anchorEl={anchorEl}
      placement="bottom-start"
      style={{ zIndex: 1300 }}
    >
      <Paper
        elevation={3}
        sx={{ width: 320, maxHeight: 400, overflow: "auto" }}
      >
        <List>
          {items.map((item) => (
            <ListItem
              key={item.title}
              button
              onClick={() => onSelect(item)}
              sx={{
                py: 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                secondary={item.description}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontWeight: 500,
                }}
                secondaryTypographyProps={{
                  variant: "caption",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Popper>
  );
};

const NotionEditor = ({ document, readOnly = false }) => {
  const { updateDocument } = useDocument();
  const [slashMenuAnchor, setSlashMenuAnchor] = useState(null);
  const [slashCommand, setSlashCommand] = useState("");
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [embedType, setEmbedType] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [meetingNotesModalOpen, setMeetingNotesModalOpen] = useState(false);

  // Debounced auto-save function
  const handleContentUpdate = useCallback(
    debounce(async (content) => {
      console.log("NotionEditor: Content update triggered", {
        documentId: document?._id,
        hasContent: !!content,
        contentType: content?.type,
      });

      if (!document?._id) {
        console.error("NotionEditor: No document ID available for saving");
        return;
      }

      try {
        console.log("NotionEditor: Sending update request");
        const response = await updateDocument(document._id, { content });
        console.log("NotionEditor: Update response received", {
          success: !!response?.data?.document,
          documentId: response?.data?.document?._id,
        });

        const updatedDocument = response.data?.document;
        if (updatedDocument) {
          showSuccessToast("Changes saved", { duration: 1000 });
        } else {
          console.error("NotionEditor: Invalid response format", response);
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("NotionEditor: Save error", {
          error: error.message,
          response: error.response?.data,
        });
        showErrorToast("Failed to save changes");
      }
    }, 1000),
    [document?._id, updateDocument]
  );

  const handleEmbedSubmit = () => {
    if (!embedUrl) return;

    if (editor) {
      switch (embedType) {
        case "youtube":
          editor.commands.setYoutubeVideo({
            src: embedUrl,
            width: 640,
            height: 480,
          });
          break;
        case "image":
          editor.commands.setImage({ src: embedUrl });
          break;
        case "link":
          editor.commands.setLink({ href: embedUrl });
          break;
      }
    }

    setEmbedDialogOpen(false);
    setEmbedUrl("");
    setEmbedType("");
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      editor.chain().focus().setImage({ src: e.target.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleMeetingNotesGenerated = (updatedDoc) => {
    // Update the editor content with the updated document
    if (editor && updatedDoc?.content) {
      // First update the editor content
      editor.commands.setContent(updatedDoc.content);

      // Force a re-render of the editor
      editor.commands.focus();

      // Then update the document state in the store
      if (document?._id === updatedDoc._id) {
        // Update the current document in the store
        updateDocument(updatedDoc._id, updatedDoc, true); // Pass true to skip debounce
      }

      showSuccessToast("Meeting notes added to document");
    }
    setMeetingNotesModalOpen(false);
  };

  const slashCommands = [
    {
      title: "AI Meeting Notes",
      description: "Generate structured notes from a meeting transcript",
      icon: <Description />,
      command: () => {
        setMeetingNotesModalOpen(true);
      },
    },
    {
      title: "Heading 1",
      description: "Large section heading",
      icon: <TitleIcon />,
      command: (editor) =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: "Heading 2",
      description: "Medium section heading",
      icon: <TitleIcon sx={{ transform: "scale(0.8)" }} />,
      command: (editor) =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: "Heading 3",
      description: "Small section heading",
      icon: <TitleIcon sx={{ transform: "scale(0.7)" }} />,
      command: (editor) =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list",
      icon: <BulletListIcon />,
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      title: "Numbered List",
      description: "Create a numbered list",
      icon: <NumberedListIcon />,
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      title: "Code Block",
      description: "Add code with syntax highlighting",
      icon: <CodeIcon />,
      command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: "Task List",
      description: "Track tasks with a to-do list",
      icon: <TaskListIcon />,
      command: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
    {
      title: "Table",
      description: "Add a table to your document",
      icon: <TableIcon />,
      command: (editor) =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      title: "YouTube Video",
      description: "Embed a YouTube video",
      icon: <YouTubeIcon />,
      command: () => {
        setEmbedType("youtube");
        setEmbedDialogOpen(true);
      },
    },
    {
      title: "Image",
      description: "Add an image from URL",
      icon: <ImageIcon />,
      command: () => {
        setEmbedType("image");
        setEmbedDialogOpen(true);
      },
    },
    {
      title: "Link",
      description: "Add a link",
      icon: <LinkIcon />,
      command: () => {
        setEmbedType("link");
        setEmbedDialogOpen(true);
      },
    },
    {
      title: "Social Media",
      description: "Embed social media content",
      icon: <InstagramIcon />,
      command: () => {
        setEmbedType("social");
        setEmbedDialogOpen(true);
      },
    },
    {
      title: "Align Left",
      description: "Align text to the left",
      icon: <FormatAlignLeft />,
      command: (editor) => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      title: "Align Center",
      description: "Center align text",
      icon: <FormatAlignCenter />,
      command: (editor) => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      title: "Align Right",
      description: "Align text to the right",
      icon: <FormatAlignRight />,
      command: (editor) => editor.chain().focus().setTextAlign("right").run(),
    },
    {
      title: "File Upload",
      description: "Upload and attach a file",
      icon: <AttachFile />,
      command: () => {
        // File upload will be handled by the FileUpload component
      },
    },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "notion-table",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "notion-image",
        },
        allowBase64: true,
        inline: true,
        handleDrop: (view, event, slice, moved) => {
          if (!moved && event.dataTransfer?.files?.length) {
            const files = Array.from(event.dataTransfer.files);
            const images = files.filter((file) =>
              file.type.startsWith("image/")
            );

            if (images.length) {
              event.preventDefault();
              images.forEach((image) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const node = view.state.schema.nodes.image.create({
                    src: e.target.result,
                  });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                };
                reader.readAsDataURL(image);
              });
              return true;
            }
          }
          return false;
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "notion-link",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        autolink: true,
        validate: (url) => /^https?:\/\//.test(url),
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "notion-youtube",
        },
        transformPastedText: true,
        width: 640,
        height: 480,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "notion-code",
        },
      }),
      Dropcursor.configure({
        color: "#2563eb",
        width: 2,
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
        emptyNodeClass: "is-editor-empty",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: document?.content || {
      type: "doc",
      content: [{ type: "paragraph", content: [] }],
    },
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      // Handle slash commands
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from - 1, to);

      if (text === "/") {
        const view = editor.view;
        const pos = view.coordsAtPos(from);
        const domNode = view.domAtPos(from).node;

        setSlashMenuAnchor(domNode);
        setSlashCommand("");
      } else if (slashMenuAnchor && !text.startsWith("/")) {
        setSlashMenuAnchor(null);
        setSlashCommand("");
      } else if (text.startsWith("/")) {
        setSlashCommand(text.slice(1));
      }

      // Save content changes
      handleContentUpdate(editor.getJSON());
    },
    editorProps: {
      handlePaste: (view, event) => {
        // Handle pasted files (images, videos)
        if (event.clipboardData?.files?.length) {
          const files = Array.from(event.clipboardData.files);

          // Handle images
          const images = files.filter((file) => file.type.startsWith("image/"));
          if (images.length) {
            event.preventDefault();
            images.forEach((image) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const node = view.state.schema.nodes.image.create({
                  src: e.target.result,
                });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              };
              reader.readAsDataURL(image);
            });
            return true;
          }
        }

        // Handle pasted text with URLs
        const text = event.clipboardData?.getData("text/plain");
        if (text) {
          // YouTube URL detection
          const youtubeMatch = text.match(
            /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          );
          if (youtubeMatch) {
            event.preventDefault();
            const videoId = youtubeMatch[1];
            const node = view.state.schema.nodes.youtube.create({
              src: `https://www.youtube.com/embed/${videoId}`,
            });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
            return true;
          }
        }

        return false;
      },
      // Handle dropped files
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const files = Array.from(event.dataTransfer.files);

          // Handle dropped images
          const images = files.filter((file) => file.type.startsWith("image/"));
          if (images.length) {
            event.preventDefault();
            images.forEach((image) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const node = view.state.schema.nodes.image.create({
                  src: e.target.result,
                });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              };
              reader.readAsDataURL(image);
            });
            return true;
          }
        }
        return false;
      },
    },
  });

  // Update editor content when document changes
  useEffect(() => {
    if (editor && document?.content) {
      editor.commands.setContent(document.content);
    }
  }, [editor, document?.content]);

  const filteredCommands = slashCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(slashCommand.toLowerCase())
  );

  const handleCommandSelect = (item) => {
    if (editor) {
      // Delete the slash command text
      editor.commands.deleteRange({
        from: editor.state.selection.from - (slashCommand.length + 1),
        to: editor.state.selection.from,
      });

      // Execute the selected command
      item.command(editor);

      // Close the menu
      setSlashMenuAnchor(null);
      setSlashCommand("");
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            minHeight: 300,
            "& .ProseMirror": {
              outline: "none",
              height: "100%",
              "& > * + *": {
                marginTop: 0.5,
              },
              "& h1": {
                fontSize: "2em",
                fontWeight: 600,
                marginBottom: "0.5em",
              },
              "& h2": {
                fontSize: "1.5em",
                fontWeight: 500,
                marginBottom: "0.5em",
              },
              "& h3": {
                fontSize: "1.17em",
                fontWeight: 500,
                marginBottom: "0.5em",
              },
              "& p": {
                marginBottom: "0.5em",
              },
              "& ul, & ol": {
                paddingLeft: "1.2em",
                marginBottom: "0.5em",
              },
              "& .notion-table": {
                borderCollapse: "collapse",
                width: "100%",
                marginBottom: "1em",
                "& td, & th": {
                  border: "1px solid",
                  borderColor: "divider",
                  padding: "0.5em",
                  position: "relative",
                },
                "& th": {
                  backgroundColor: "action.hover",
                  fontWeight: 500,
                },
              },
              "& .notion-code": {
                backgroundColor: "action.hover",
                padding: "0.75em 1em",
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "0.9em",
                fontFamily: "monospace",
              },
              "& .notion-youtube": {
                width: "100%",
                maxWidth: "640px",
                marginBottom: "1em",
                aspectRatio: "16/9",
              },
              "& .notion-image": {
                maxWidth: "100%",
                height: "auto",
                cursor: "pointer",
                borderRadius: "4px",
                "&:hover": {
                  boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.2)",
                },
              },
              "& .notion-link": {
                color: "primary.main",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              "& ul[data-type='taskList']": {
                listStyle: "none",
                padding: 0,
                "& li": {
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                },
                "& input[type='checkbox']": {
                  margin: "0.5em 0.5em 0.5em 0",
                },
              },
              "&.is-editor-empty:first-of-type::before": {
                content: "attr(data-placeholder)",
                color: "text.disabled",
                pointerEvents: "none",
                float: "left",
                height: 0,
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Paper>

      <SlashCommandList
        items={filteredCommands}
        anchorEl={slashMenuAnchor}
        onSelect={handleCommandSelect}
      />

      <Dialog open={embedDialogOpen} onClose={() => setEmbedDialogOpen(false)}>
        <DialogTitle>
          {embedType === "youtube"
            ? "Embed YouTube Video"
            : embedType === "image"
            ? "Add Image"
            : embedType === "link"
            ? "Add Link"
            : "Embed Social Media"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={
              embedType === "youtube"
                ? "YouTube URL"
                : embedType === "image"
                ? "Image URL"
                : "URL"
            }
            type="url"
            fullWidth
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmbedDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEmbedSubmit} variant="contained">
            Embed
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Component */}
      <FileUpload
        documentId={document?._id}
        workspaceId={document?.workspace}
        onFileUploaded={(file) => {
          editor
            .chain()
            .focus()
            .setLink({ href: file.url, target: "_blank" })
            .insertContent(file.name)
            .run();
        }}
        compact
      />

      <MeetingNotesModal
        open={meetingNotesModalOpen}
        onClose={() => setMeetingNotesModalOpen(false)}
        onSave={handleMeetingNotesGenerated}
        currentDocument={document}
      />
    </Box>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    // Check if the last argument is true (skipDebounce)
    const skipDebounce = args[args.length - 1] === true;
    if (skipDebounce) {
      // Remove the skipDebounce flag and execute immediately
      args.pop();
      return func(...args);
    }

    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default NotionEditor;
