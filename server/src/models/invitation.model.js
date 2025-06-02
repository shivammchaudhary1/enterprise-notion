import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "cancelled"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    acceptedAt: {
      type: Date,
    },
    acceptedBy: {
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
invitationSchema.index({ email: 1, workspace: 1 });
invitationSchema.index({ token: 1 });
invitationSchema.index({ status: 1 });
invitationSchema.index({ expiresAt: 1 });
invitationSchema.index({ workspace: 1, status: 1 });

// Virtual for checking if invitation is expired
invitationSchema.virtual("isExpired").get(function () {
  return this.expiresAt < new Date() || this.status === "expired";
});

// Virtual for checking if invitation is valid
invitationSchema.virtual("isValid").get(function () {
  return this.status === "pending" && !this.isExpired;
});

// Pre-save middleware to automatically expire old invitations
invitationSchema.pre("save", function (next) {
  if (this.expiresAt < new Date() && this.status === "pending") {
    this.status = "expired";
  }
  next();
});

// Static method to find valid invitation by token
invitationSchema.statics.findValidByToken = function (token) {
  return this.findOne({
    token,
    status: "pending",
    expiresAt: { $gt: new Date() },
  })
    .populate("workspace", "name emoji")
    .populate("invitedBy", "name email");
};

// Static method to find pending invitations for a workspace
invitationSchema.statics.findPendingForWorkspace = function (workspaceId) {
  return this.find({
    workspace: workspaceId,
    status: "pending",
    expiresAt: { $gt: new Date() },
  })
    .populate("invitedBy", "name email")
    .sort({ createdAt: -1 });
};

// Static method to find pending invitation by email and workspace
invitationSchema.statics.findPendingByEmailAndWorkspace = function (
  email,
  workspaceId
) {
  return this.findOne({
    email: email.toLowerCase(),
    workspace: workspaceId,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });
};

// Instance method to accept invitation
invitationSchema.methods.accept = function (userId) {
  this.status = "accepted";
  this.acceptedAt = new Date();
  this.acceptedBy = userId;
  return this.save();
};

// Instance method to cancel invitation
invitationSchema.methods.cancel = function () {
  this.status = "cancelled";
  return this.save();
};

// Instance method to check if invitation can be accepted
invitationSchema.methods.canAccept = function () {
  return this.status === "pending" && this.expiresAt > new Date();
};

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;
