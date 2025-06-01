import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a document title"],
      trim: true,
      maxLength: [200, "Title cannot be more than 200 characters"],
      default: "Untitled",
    },
    content: {
      type: Object,
      default: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [],
          },
        ],
      },
    },
    emoji: {
      type: String,
      default: "📄",
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },
    position: {
      type: Number,
      default: 0,
    },
    permissions: {
      inherit: {
        type: Boolean,
        default: true,
      },
      specificPermissions: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          permission: {
            type: String,
            enum: ["view", "comment", "edit"],
            default: "view",
          },
        },
      ],
    },
    settings: {
      isPublic: {
        type: Boolean,
        default: false,
      },
      allowComments: {
        type: Boolean,
        default: true,
      },
      showInSearch: {
        type: Boolean,
        default: true,
      },
    },
    metadata: {
      coverImage: {
        type: String,
      },
      icon: {
        type: String,
      },
      tags: [
        {
          type: String,
          trim: true,
        },
      ],
      lastViewed: {
        type: Date,
        default: Date.now,
      },
      viewCount: {
        type: Number,
        default: 0,
      },
    },
    favorites: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    version: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
documentSchema.index({ workspace: 1, parent: 1, position: 1 });
documentSchema.index({ workspace: 1, isDeleted: 1 });
documentSchema.index({ author: 1 });
documentSchema.index({ "metadata.tags": 1 });
documentSchema.index({ title: "text", content: "text" });

// Virtual for child documents
documentSchema.virtual("children", {
  ref: "Document",
  localField: "_id",
  foreignField: "parent",
  options: { sort: { position: 1 } },
});

// Virtual for favorites count
documentSchema.virtual("favoritesCount").get(function () {
  return this.favorites ? this.favorites.length : 0;
});

// Virtual for depth level
documentSchema.virtual("depth").get(function () {
  let depth = 0;
  let current = this.parent;
  while (current && depth < 10) {
    // Prevent infinite loops
    depth++;
    current = current.parent;
  }
  return depth;
});

// Pre-save middleware to update version and lastEditedBy
documentSchema.pre("save", function (next) {
  if (this.isModified("content") || this.isModified("title")) {
    if (!this.isNew) {
      this.version += 1;
    }
    this.metadata.lastViewed = new Date();
  }
  next();
});

// Instance method to check if user has favorited
documentSchema.methods.isFavoritedBy = function (userId) {
  return this.favorites.some(
    (fav) => fav.user.toString() === userId.toString()
  );
};

// Instance method to add favorite
documentSchema.methods.addToFavorites = function (userId) {
  if (!this.isFavoritedBy(userId)) {
    this.favorites.push({ user: userId });
  }
  return this.save();
};

// Instance method to remove favorite
documentSchema.methods.removeFromFavorites = function (userId) {
  this.favorites = this.favorites.filter(
    (fav) => fav.user.toString() !== userId.toString()
  );
  return this.save();
};

// Instance method to get full path
documentSchema.methods.getPath = async function () {
  const path = [this];
  let current = this;

  while (current.parent) {
    current = await this.constructor.findById(current.parent);
    if (current) {
      path.unshift(current);
    } else {
      break;
    }
  }

  return path;
};

// Static method to get document tree
documentSchema.statics.getTree = async function (workspaceId, parentId = null) {
  const documents = await this.find({
    workspace: workspaceId,
    parent: parentId,
    isDeleted: false,
  })
    .sort({ position: 1 })
    .populate("author", "name email")
    .populate("lastEditedBy", "name email");

  for (let doc of documents) {
    doc.children = await this.getTree(workspaceId, doc._id);
  }

  return documents;
};

// Static method to reorder documents
documentSchema.statics.reorderDocuments = async function (
  workspaceId,
  parentId,
  documentIds
) {
  const updatePromises = documentIds.map((docId, index) =>
    this.findOneAndUpdate(
      { _id: docId, workspace: workspaceId, parent: parentId },
      { position: index },
      { new: true }
    )
  );

  return Promise.all(updatePromises);
};

const Document = mongoose.model("Document", documentSchema);

export default Document;
