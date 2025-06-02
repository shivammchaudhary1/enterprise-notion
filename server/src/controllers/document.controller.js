import Document from "../models/document.model.js";
import Workspace from "../models/workspace.model.js";
import { errorMessage, successMessage } from "../utils/response.js";

// Create document
export const createDocument = async (req, res) => {
  try {
    const { title, content, emoji, parentId, workspaceId } = req.body;
    const userId = req.user.userId;

    // Verify workspace exists and user has access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    if (!workspace.isMember(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    if (!workspace.canEdit(userId)) {
      return res
        .status(403)
        .json(errorMessage("No permission to create documents"));
    }

    // If parentId is provided, verify parent document exists and is in same workspace
    if (parentId) {
      const parentDoc = await Document.findOne({
        _id: parentId,
        workspace: workspaceId,
        isDeleted: false,
      });

      if (!parentDoc) {
        return res.status(404).json(errorMessage("Parent document not found"));
      }
    }

    // Get position for new document
    const siblingCount = await Document.countDocuments({
      workspace: workspaceId,
      parent: parentId || null,
      isDeleted: false,
    });

    const document = new Document({
      title: title || "Untitled",
      content: content || {
        type: "doc",
        content: [{ type: "paragraph", content: [] }],
      },
      emoji: emoji || "📄",
      workspace: workspaceId,
      author: userId,
      parent: parentId || null,
      position: siblingCount,
      lastEditedBy: userId,
    });

    await document.save();

    // Populate references
    await document.populate("author", "name email");
    await document.populate("lastEditedBy", "name email");
    await document.populate("workspace", "name");

    return res.status(201).json(
      successMessage("Document created successfully", {
        document,
      })
    );
  } catch (error) {
    console.error("Create document error:", error);
    return res.status(500).json(errorMessage("Failed to create document"));
  }
};

// Get documents in workspace
export const getWorkspaceDocuments = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { parentId = null, tree = false } = req.query;
    const userId = req.user.userId;

    // Verify workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    if (!workspace.isMember(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    let documents;

    if (tree === "true") {
      // Get full document tree
      documents = await Document.getTree(workspaceId);
    } else {
      // Get documents at specific level
      documents = await Document.find({
        workspace: workspaceId,
        parent: parentId || null,
        isDeleted: false,
      })
        .sort({ position: 1 })
        .populate("author", "name email")
        .populate("lastEditedBy", "name email");
    }

    return res.status(200).json(
      successMessage("Documents retrieved successfully", {
        documents,
      })
    );
  } catch (error) {
    console.error("Get documents error:", error);
    return res.status(500).json(errorMessage("Failed to retrieve documents"));
  }
};

// Get document by ID
export const getDocumentById = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;

    const document = await Document.findOne({
      _id: documentId,
      isDeleted: false,
    })
      .populate("author", "name email")
      .populate("lastEditedBy", "name email")
      .populate("workspace", "name")
      .populate("parent", "title");

    if (!document) {
      return res.status(404).json(errorMessage("Document not found"));
    }

    // Verify workspace access
    const workspace = await Workspace.findById(document.workspace._id);
    if (!workspace.isMember(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Update view count and last viewed
    document.metadata.viewCount += 1;
    document.metadata.lastViewed = new Date();
    await document.save();

    return res.status(200).json(
      successMessage("Document retrieved successfully", {
        document,
      })
    );
  } catch (error) {
    console.error("Get document error:", error);
    return res.status(500).json(errorMessage("Failed to retrieve document"));
  }
};

// Update document
export const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { title, content, emoji, metadata } = req.body;
    const userId = req.user.userId;

    console.log("Backend: Update document request", {
      documentId,
      userId,
      hasContent: !!content,
      hasTitle: !!title,
      hasEmoji: !!emoji,
    });

    const document = await Document.findOne({
      _id: documentId,
      isDeleted: false,
    }).populate("workspace");

    if (!document) {
      console.error("Backend: Document not found", { documentId });
      return res.status(404).json(errorMessage("Document not found"));
    }

    // Verify workspace access and edit permission
    const workspace = await Workspace.findById(document.workspace._id);
    if (!workspace.isMember(userId) || !workspace.canEdit(userId)) {
      console.error("Backend: Permission denied", {
        userId,
        workspaceId: workspace._id,
      });
      return res
        .status(403)
        .json(errorMessage("No permission to edit document"));
    }

    console.log("Backend: Updating document fields");

    // Update fields
    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;
    if (emoji !== undefined) document.emoji = emoji;
    if (metadata) {
      document.metadata = { ...document.metadata, ...metadata };
    }

    document.lastEditedBy = userId;
    await document.save();

    // Populate references
    await document.populate("author", "name email");
    await document.populate("lastEditedBy", "name email");

    console.log("Backend: Document updated successfully", {
      documentId: document._id,
      lastEditedBy: userId,
    });

    return res.status(200).json(
      successMessage("Document updated successfully", {
        document: document.toObject(),
      })
    );
  } catch (error) {
    console.error("Backend: Update document error", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json(errorMessage("Failed to update document"));
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;

    const document = await Document.findOne({
      _id: documentId,
      isDeleted: false,
    }).populate("workspace");

    if (!document) {
      return res.status(404).json(errorMessage("Document not found"));
    }

    // Verify workspace access and edit permission
    const workspace = await Workspace.findById(document.workspace._id);
    if (!workspace.isMember(userId) || !workspace.canEdit(userId)) {
      return res
        .status(403)
        .json(errorMessage("No permission to delete document"));
    }

    // Soft delete document and all children
    const deleteDocumentAndChildren = async (docId) => {
      const doc = await Document.findById(docId);
      if (doc) {
        doc.isDeleted = true;
        doc.deletedAt = new Date();
        await doc.save();

        // Find and delete children
        const children = await Document.find({
          parent: docId,
          isDeleted: false,
        });
        for (const child of children) {
          await deleteDocumentAndChildren(child._id);
        }
      }
    };

    await deleteDocumentAndChildren(documentId);

    return res
      .status(200)
      .json(successMessage("Document deleted successfully"));
  } catch (error) {
    console.error("Delete document error:", error);
    return res.status(500).json(errorMessage("Failed to delete document"));
  }
};

// // Move document (change parent)
// export const moveDocument = async (req, res) => {
//   try {
//     const { documentId } = req.params;
//     const { newParentId, newPosition } = req.body;
//     const userId = req.user.id;

//     const document = await Document.findOne({
//       _id: documentId,
//       isDeleted: false,
//     }).populate("workspace");

//     if (!document) {
//       return res.status(404).json(errorMessage("Document not found"));
//     }

//     // Verify workspace access and edit permission
//     const workspace = await Workspace.findById(document.workspace._id);
//     if (!workspace.isMember(userId) || !workspace.canEdit(userId)) {
//       return res
//         .status(403)
//         .json(errorMessage("No permission to move document"));
//     }

//     // If newParentId is provided, verify it exists and is in same workspace
//     if (newParentId) {
//       const parentDoc = await Document.findOne({
//         _id: newParentId,
//         workspace: document.workspace._id,
//         isDeleted: false,
//       });

//       if (!parentDoc) {
//         return res
//           .status(404)
//           .json(errorMessage("New parent document not found"));
//       }

//       // Prevent circular references
//       const path = await parentDoc.getPath();
//       if (path.some((doc) => doc._id.toString() === documentId)) {
//         return res
//           .status(400)
//           .json(errorMessage("Cannot move document to its own child"));
//       }
//     }

//     const oldParent = document.parent;
//     const oldPosition = document.position;

//     // Update document
//     document.parent = newParentId || null;
//     document.lastEditedBy = userId;

//     // Handle positioning
//     if (newPosition !== undefined) {
//       // Get siblings in new location
//       const siblings = await Document.find({
//         workspace: document.workspace._id,
//         parent: newParentId || null,
//         _id: { $ne: documentId },
//         isDeleted: false,
//       }).sort({ position: 1 });

//       // Reorder siblings
//       const newSiblings = [...siblings];
//       newSiblings.splice(newPosition, 0, document);

//       // Update positions
//       const updatePromises = newSiblings.map((doc, index) => {
//         if (doc._id.toString() === documentId) {
//           document.position = index;
//           return document.save();
//         } else {
//           return Document.findByIdAndUpdate(doc._id, { position: index });
//         }
//       });

//       await Promise.all(updatePromises);
//     } else {
//       // Just append to end
//       const siblingCount = await Document.countDocuments({
//         workspace: document.workspace._id,
//         parent: newParentId || null,
//         _id: { $ne: documentId },
//         isDeleted: false,
//       });
//       document.position = siblingCount;
//       await document.save();
//     }

//     // Reorder old siblings
//     if (oldParent !== newParentId) {
//       const oldSiblings = await Document.find({
//         workspace: document.workspace._id,
//         parent: oldParent,
//         position: { $gt: oldPosition },
//         isDeleted: false,
//       });

//       const reorderPromises = oldSiblings.map((doc) =>
//         Document.findByIdAndUpdate(doc._id, {
//           $inc: { position: -1 },
//         })
//       );

//       await Promise.all(reorderPromises);
//     }

//     // Populate and return
//     await document.populate("author", "name email");
//     await document.populate("lastEditedBy", "name email");
//     await document.populate("parent", "title");

//     return res.status(200).json(
//       successMessage("Document moved successfully", {
//         document,
//       })
//     );
//   } catch (error) {
//     console.error("Move document error:", error);
//     return res.status(500).json(errorMessage("Failed to move document"));
//   }
// };

// Reorder documents
export const reorderDocuments = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { parentId, documentIds } = req.body;
    const userId = req.user.userId;

    // Verify workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    if (!workspace.isMember(userId) || !workspace.canEdit(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    const reorderedDocuments = await Document.reorderDocuments(
      workspaceId,
      parentId || null,
      documentIds
    );

    return res.status(200).json(
      successMessage("Documents reordered successfully", {
        documents: reorderedDocuments,
      })
    );
  } catch (error) {
    console.error("Reorder documents error:", error);
    return res.status(500).json(errorMessage("Failed to reorder documents"));
  }
};

// Search documents in workspace
export const searchDocuments = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { query, tags, author, limit = 20, page = 1 } = req.query;
    const userId = req.user.userId;

    // Verify workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    if (!workspace.isMember(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Build search criteria
    const searchCriteria = {
      workspace: workspaceId,
      isDeleted: false,
      "settings.showInSearch": true,
    };

    // Text search
    if (query) {
      searchCriteria.$text = { $search: query };
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      searchCriteria["metadata.tags"] = { $in: tagArray };
    }

    // Filter by author
    if (author) {
      searchCriteria.author = author;
    }

    const skip = (page - 1) * limit;

    const documents = await Document.find(searchCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "name email")
      .populate("lastEditedBy", "name email")
      .populate("parent", "title")
      .sort({
        ...(query ? { score: { $meta: "textScore" } } : {}),
        updatedAt: -1,
      });

    const total = await Document.countDocuments(searchCriteria);

    return res.status(200).json(
      successMessage("Search completed successfully", {
        documents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("Search documents error:", error);
    return res.status(500).json(errorMessage("Failed to search documents"));
  }
};

// Get document favorites for user
export const getUserFavorites = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    // Verify workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      isDeleted: false,
    });

    if (!workspace) {
      return res.status(404).json(errorMessage("Workspace not found"));
    }

    if (!workspace.isMember(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    const favoriteDocuments = await Document.find({
      workspace: workspaceId,
      "favorites.user": userId,
      isDeleted: false,
    })
      .populate("author", "name email")
      .populate("lastEditedBy", "name email")
      .sort({ "favorites.addedAt": -1 });

    return res.status(200).json(
      successMessage("Favorites retrieved successfully", {
        documents: favoriteDocuments,
      })
    );
  } catch (error) {
    console.error("Get favorites error:", error);
    return res.status(500).json(errorMessage("Failed to retrieve favorites"));
  }
};

// Toggle document favorite
export const toggleFavorite = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;

    const document = await Document.findOne({
      _id: documentId,
      isDeleted: false,
    }).populate("workspace");

    if (!document) {
      return res.status(404).json(errorMessage("Document not found"));
    }

    // Verify workspace access
    const workspace = await Workspace.findById(document.workspace._id);
    if (!workspace.isMember(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    const isFavorited = document.isFavoritedBy(userId);

    if (isFavorited) {
      await document.removeFromFavorites(userId);
    } else {
      await document.addToFavorites(userId);
    }

    await document.populate("author", "name email");
    await document.populate("lastEditedBy", "name email");

    return res.status(200).json(
      successMessage(
        `Document ${isFavorited ? "removed from" : "added to"} favorites`,
        {
          document,
          isFavorited: !isFavorited,
        }
      )
    );
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return res.status(500).json(errorMessage("Failed to toggle favorite"));
  }
};

// Move document to different parent
export const moveDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { newParentId, newPosition } = req.body;
    const userId = req.user.userId;

    const document = await Document.findOne({
      _id: documentId,
      isDeleted: false,
    }).populate("workspace");

    if (!document) {
      return res.status(404).json(errorMessage("Document not found"));
    }

    // Verify workspace access and edit permission
    const workspace = await Workspace.findById(document.workspace._id);
    if (!workspace.isMember(userId) || !workspace.canEdit(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Verify new parent if provided
    if (newParentId) {
      const newParent = await Document.findOne({
        _id: newParentId,
        workspace: document.workspace._id,
        isDeleted: false,
      });

      if (!newParent) {
        return res.status(404).json(errorMessage("New parent not found"));
      }

      // Prevent circular reference
      if (newParentId === documentId) {
        return res
          .status(400)
          .json(errorMessage("Cannot move document to itself"));
      }
    }

    // Get documents count in new location to determine position
    const siblingsCount = await Document.countDocuments({
      workspace: document.workspace._id,
      parent: newParentId || null,
      isDeleted: false,
    });

    // Update document
    document.parent = newParentId || null;
    document.position = newPosition !== undefined ? newPosition : siblingsCount;
    await document.save();

    // Reorder other documents in the new location if specific position was requested
    if (newPosition !== undefined) {
      const siblings = await Document.find({
        workspace: document.workspace._id,
        parent: newParentId || null,
        _id: { $ne: documentId },
        isDeleted: false,
      }).sort({ position: 1 });

      // Update positions of other documents
      for (let i = 0; i < siblings.length; i++) {
        const expectedPosition = i >= newPosition ? i + 1 : i;
        if (siblings[i].position !== expectedPosition) {
          siblings[i].position = expectedPosition;
          await siblings[i].save();
        }
      }
    }

    await document.populate("author", "name email");
    await document.populate("lastEditedBy", "name email");
    await document.populate("parent", "title");

    return res.status(200).json(
      successMessage("Document moved successfully", {
        document,
      })
    );
  } catch (error) {
    console.error("Move document error:", error);
    return res.status(500).json(errorMessage("Failed to move document"));
  }
};

// Get document breadcrumb path
export const getDocumentPath = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;

    const document = await Document.findOne({
      _id: documentId,
      isDeleted: false,
    }).populate("workspace");

    if (!document) {
      return res.status(404).json(errorMessage("Document not found"));
    }

    // Verify workspace access
    const workspace = await Workspace.findById(document.workspace._id);
    if (!workspace.isMember(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    const path = await document.getPath();

    return res.status(200).json(
      successMessage("Document path retrieved successfully", {
        path: path.map((doc) => ({
          _id: doc._id,
          title: doc.title,
          emoji: doc.emoji,
        })),
      })
    );
  } catch (error) {
    console.error("Get document path error:", error);
    return res.status(500).json(errorMessage("Failed to get document path"));
  }
};

// Duplicate document
export const duplicateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;

    const sourceDocument = await Document.findOne({
      _id: documentId,
      isDeleted: false,
    }).populate("workspace");

    if (!sourceDocument) {
      return res.status(404).json(errorMessage("Document not found"));
    }

    // Verify workspace access and edit permission
    const workspace = await Workspace.findById(sourceDocument.workspace._id);
    if (!workspace.isMember(userId) || !workspace.canEdit(userId)) {
      return res.status(403).json(errorMessage("Access denied"));
    }

    // Get position for new document (next to source document)
    const siblingCount = await Document.countDocuments({
      workspace: sourceDocument.workspace._id,
      parent: sourceDocument.parent,
      isDeleted: false,
    });

    // Create new document with copied content
    const duplicatedDocument = new Document({
      title: `${sourceDocument.title} (Copy)`,
      content: sourceDocument.content,
      emoji: sourceDocument.emoji,
      workspace: sourceDocument.workspace._id,
      author: userId,
      parent: sourceDocument.parent,
      position: siblingCount,
      lastEditedBy: userId,
      metadata: {
        ...sourceDocument.metadata,
        viewCount: 0,
        lastViewed: new Date(),
      },
      settings: sourceDocument.settings,
    });

    await duplicatedDocument.save();

    // Populate references
    await duplicatedDocument.populate("author", "name email");
    await duplicatedDocument.populate("lastEditedBy", "name email");

    return res.status(200).json(
      successMessage("Document duplicated successfully", {
        document: duplicatedDocument,
      })
    );
  } catch (error) {
    console.error("Duplicate document error:", error);
    return res.status(500).json(errorMessage("Failed to duplicate document"));
  }
};
