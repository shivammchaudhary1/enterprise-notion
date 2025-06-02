import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Box, Paper } from "@mui/material";
import EditorToolbar from "./EditorToolbar";
import { useDocument } from "../../hooks/useDocument";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

// Initialize lowlight with common languages
const lowlight = createLowlight(common);

const DocumentEditor = ({ document, readOnly = false }) => {
  const { updateDocument } = useDocument();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
        allowBase64: true,
        inline: true,
        // Enable drag-and-drop for images
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
          class: "editor-link",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        // Auto-link pasted URLs
        autolink: true,
        // Validate URLs
        validate: (url) => /^https?:\/\//.test(url),
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "editor-youtube",
        },
        // Auto-embed YouTube links
        transformPastedText: true,
        width: 640,
        height: 480,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "editor-table",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "editor-code-block",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Dropcursor.configure({
        color: "#2563eb",
        width: 2,
      }),
      Placeholder.configure({
        placeholder: "Start writing or paste content...",
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
      handleContentUpdate(editor.getJSON());
    },
    // Enhanced paste handling
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

  // Debounced auto-save with success/error feedback
  const handleContentUpdate = useCallback(
    debounce(async (content) => {
      console.log("Editor: Content update triggered", {
        documentId: document?._id,
        hasContent: !!content,
        contentType: content?.type,
      });

      if (!document?._id) {
        console.error("Editor: No document ID available for saving");
        return;
      }

      try {
        console.log("Editor: Sending update request");
        const response = await updateDocument(document._id, { content });
        console.log("Editor: Update response received", {
          success: !!response?.data?.document,
          documentId: response?.data?.document?._id,
        });

        const updatedDocument = response.data?.document;
        if (updatedDocument) {
          showSuccessToast("Changes saved", { duration: 1000 });
        } else {
          console.error("Editor: Invalid response format", response);
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Editor: Save error", {
          error: error.message,
          response: error.response?.data,
        });
        showErrorToast("Failed to save changes");
      }
    }, 1000),
    [document?._id, updateDocument]
  );

  // Update editor content when document changes
  useEffect(() => {
    if (editor && document?.content) {
      editor.commands.setContent(document.content);
    }
  }, [editor, document?.content]);

  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <EditorToolbar
          editor={editor}
          readOnly={readOnly}
          document={document}
        />
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
              "& img": {
                maxWidth: "100%",
                height: "auto",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.2)",
                },
              },
              "& iframe": {
                maxWidth: "100%",
                border: "none",
                borderRadius: 1,
              },
              "& table": {
                borderCollapse: "collapse",
                width: "100%",
                overflow: "hidden",
                marginBottom: 2,
                "& td, & th": {
                  border: "1px solid",
                  borderColor: "divider",
                  padding: 1,
                  position: "relative",
                },
              },
              "& pre": {
                backgroundColor: "background.paper",
                borderRadius: 1,
                padding: 2,
                overflow: "auto",
              },
              '& ul[data-type="taskList"]': {
                listStyle: "none",
                padding: 0,
                "& li": {
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                },
                '& input[type="checkbox"]': {
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
    </Box>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default DocumentEditor;
