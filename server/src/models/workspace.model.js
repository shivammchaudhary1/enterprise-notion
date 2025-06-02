import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a workspace name"],
      trim: true,
      maxLength: [100, "Workspace name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot be more than 500 characters"],
    },
    emoji: {
      type: String,
      default: "🏠",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "editor", "viewer"],
          default: "viewer",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      isPublic: {
        type: Boolean,
        default: false,
      },
      allowMemberInvites: {
        type: Boolean,
        default: true,
      },
      defaultPermission: {
        type: String,
        enum: ["editor", "viewer"],
        default: "viewer",
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ "members.user": 1 });
workspaceSchema.index({ isDeleted: 1 });

// Virtual for member count
workspaceSchema.virtual("memberCount").get(function () {
  return this.members ? this.members.length : 0;
});

// Pre-save middleware to add owner as member
workspaceSchema.pre("save", function (next) {
  if (this.isNew && this.owner) {
    // Add owner as member with owner role if not already present
    const ownerExists = this.members.some(
      (member) => member.user.toString() === this.owner.toString()
    );
    if (!ownerExists) {
      this.members.push({
        user: this.owner,
        role: "owner",
      });
    }
  }
  next();
});

// Instance method to check if user is member
workspaceSchema.methods.isMember = function (userId) {
  return this.members.some(
    (member) => member.user.toString() === userId.toString()
  );
};

// Instance method to get user role in workspace
workspaceSchema.methods.getUserRole = function (userId) {
  const member = this.members.find(
    (member) => member.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

// Instance method to check if user can edit
workspaceSchema.methods.canEdit = function (userId) {
  const role = this.getUserRole(userId);
  return ["owner", "admin", "editor"].includes(role);
};

// Instance method to check if user can admin
workspaceSchema.methods.canAdmin = function (userId) {
  const role = this.getUserRole(userId);
  return ["owner", "admin"].includes(role);
};

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
