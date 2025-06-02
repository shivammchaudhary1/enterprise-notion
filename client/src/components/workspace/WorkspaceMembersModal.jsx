import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useAuthStore } from "../../stores";
import { invitationAPI } from "../../api/invitationAPI";
import InviteMemberModal from "./InviteMemberModal";

const WorkspaceMembersModal = ({ open, onClose, workspace }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { removeMember, updateMemberRole } = useWorkspace();

  const [currentTab, setCurrentTab] = useState(0);
  const [invitations, setInvitations] = useState([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [memberMenuAnchor, setMemberMenuAnchor] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { value: "viewer", label: "Viewer", description: "Can view and comment" },
    {
      value: "editor",
      label: "Editor",
      description: "Can view, comment, and edit",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Can manage members and settings",
    },
  ];

  // Fetch invitations when modal opens
  useEffect(() => {
    if (open && workspace && canManageMembers()) {
      fetchInvitations();
    }
  }, [open, workspace]);

  const fetchInvitations = async () => {
    if (!workspace) return;

    setInvitationsLoading(true);
    try {
      const response = await invitationAPI.getWorkspaceInvitations(
        workspace._id
      );
      setInvitations(response.data || []);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
      // Don't show error for invitations fetch failure
    } finally {
      setInvitationsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Check if current user can manage members
  const canManageMembers = () => {
    if (!workspace || !user) return false;

    const userMember = workspace.members?.find(
      (member) => member.user._id === user.id || member.user === user.id
    );

    return (
      userMember && (userMember.role === "owner" || userMember.role === "admin")
    );
  };

  // Check if current user is workspace owner
  const isOwner = () => {
    return workspace?.owner?._id === user?.id || workspace?.owner === user?.id;
  };

  const handleMemberMenuOpen = (event, member) => {
    setMemberMenuAnchor(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMemberMenuClose = () => {
    setMemberMenuAnchor(null);
    setSelectedMember(null);
  };

  const handleRemoveMember = () => {
    setRemoveDialogOpen(true);
    handleMemberMenuClose();
  };

  const handleEditRole = () => {
    setNewRole(selectedMember.role);
    setEditRoleDialogOpen(true);
    handleMemberMenuClose();
  };

  const confirmRemoveMember = async () => {
    if (!selectedMember || !workspace) return;

    setLoading(true);
    setError("");

    try {
      await removeMember(workspace._id, selectedMember._id);
      setRemoveDialogOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error("Failed to remove member:", error);
      setError(error.message || "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const confirmUpdateRole = async () => {
    if (!selectedMember || !workspace || !newRole) return;

    setLoading(true);
    setError("");

    try {
      await updateMemberRole(workspace._id, selectedMember._id, newRole);
      setEditRoleDialogOpen(false);
      setSelectedMember(null);
      setNewRole("");
    } catch (error) {
      console.error("Failed to update member role:", error);
      setError(error.message || "Failed to update member role");
    } finally {
      setLoading(false);
    }
  };

  const getRoleChipColor = (role) => {
    switch (role) {
      case "owner":
        return "error";
      case "admin":
        return "warning";
      case "editor":
        return "primary";
      case "viewer":
        return "default";
      default:
        return "default";
    }
  };

  const canEditMember = (member) => {
    if (!canManageMembers()) return false;
    if (member.role === "owner") return false;
    if (member.user._id === user.id) return false;
    return true;
  };

  const handleResendInvitation = async (invitation) => {
    try {
      setError("");
      await invitationAPI.resend(invitation._id);
      // Refresh invitations list
      fetchInvitations();
    } catch (error) {
      console.error("Failed to resend invitation:", error);
      setError(error.message || "Failed to resend invitation");
    }
  };

  const handleCancelInvitation = async (invitation) => {
    try {
      setError("");
      await invitationAPI.cancel(invitation._id);
      // Refresh invitations list
      fetchInvitations();
    } catch (error) {
      console.error("Failed to cancel invitation:", error);
      setError(error.message || "Failed to cancel invitation");
    }
  };

  const getInvitationStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "success";
      case "cancelled":
        return "error";
      case "expired":
        return "default";
      default:
        return "default";
    }
  };

  if (!workspace) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Workspace Members
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {error && (
            <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
              {error}
            </Alert>
          )}

          {canManageMembers() && (
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setInviteModalOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Invite Member
              </Button>
            </Box>
          )}

          {/* Tabs for Members and Invitations */}
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{ px: 3, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupIcon fontSize="small" />
                  Members ({workspace.members?.length || 0})
                </Box>
              }
            />
            {canManageMembers() && (
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    Invitations ({invitations.length})
                  </Box>
                }
              />
            )}
          </Tabs>

          {/* Members Tab */}
          {currentTab === 0 && (
            <Box sx={{ px: 3, py: 2 }}>
              <List>
                {workspace.members?.map((member, index) => (
                  <React.Fragment key={member._id || member.user._id}>
                    <ListItem
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {member.user?.name?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            {member.user?.name || "Unknown User"}
                            {member.user._id === user.id && " (You)"}
                          </Typography>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {member.user?.email}
                            </Typography>
                            <Chip
                              label={member.role}
                              size="small"
                              color={getRoleChipColor(member.role)}
                              variant="outlined"
                            />
                          </Box>
                        }
                      />

                      {canEditMember(member) && (
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={(e) => handleMemberMenuOpen(e, member)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>

                    {index < workspace.members.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {/* Invitations Tab */}
          {currentTab === 1 && canManageMembers() && (
            <Box sx={{ px: 3, py: 2 }}>
              {invitationsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : invitations.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <EmailIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No pending invitations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Invite team members to collaborate in this workspace
                  </Typography>
                </Box>
              ) : (
                <List>
                  {invitations.map((invitation, index) => (
                    <React.Fragment key={invitation._id}>
                      <ListItem
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.secondary.main,
                              width: 40,
                              height: 40,
                            }}
                          >
                            <EmailIcon />
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="medium">
                              {invitation.email}
                            </Typography>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 0.5,
                              }}
                            >
                              <Chip
                                label={invitation.role}
                                size="small"
                                color={getRoleChipColor(invitation.role)}
                                variant="outlined"
                              />
                              <Chip
                                label={invitation.status}
                                size="small"
                                color={getInvitationStatusColor(
                                  invitation.status
                                )}
                                variant="outlined"
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Invited{" "}
                                {new Date(
                                  invitation.createdAt
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />

                        <ListItemSecondaryAction>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {invitation.status === "pending" && (
                              <>
                                <IconButton
                                  onClick={() =>
                                    handleResendInvitation(invitation)
                                  }
                                  size="small"
                                  title="Resend invitation"
                                >
                                  <SendIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    handleCancelInvitation(invitation)
                                  }
                                  size="small"
                                  title="Cancel invitation"
                                >
                                  <CancelIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>

                      {index < invitations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Member Menu */}
      <Menu
        anchorEl={memberMenuAnchor}
        open={Boolean(memberMenuAnchor)}
        onClose={handleMemberMenuClose}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <MenuItem onClick={handleEditRole}>
          <EditIcon sx={{ mr: 1 }} />
          Change Role
        </MenuItem>
        <MenuItem onClick={handleRemoveMember} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Remove Member
        </MenuItem>
      </Menu>

      {/* Remove Member Dialog */}
      <Dialog
        open={removeDialogOpen}
        onClose={() => !loading && setRemoveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove{" "}
            <strong>{selectedMember?.user?.name}</strong> from this workspace?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={confirmRemoveMember}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={editRoleDialogOpen}
        onClose={() => !loading && setEditRoleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Member Role</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Change role for <strong>{selectedMember?.user?.name}</strong>
          </Typography>

          <FormControl fullWidth disabled={loading}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              {roles.map((roleOption) => (
                <MenuItem key={roleOption.value} value={roleOption.value}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {roleOption.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {roleOption.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditRoleDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmUpdateRole}
            variant="contained"
            disabled={loading || !newRole}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Updating..." : "Update Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite Member Modal */}
      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        workspaceId={workspace._id}
        onSuccess={() => {
          // Refresh invitations when a new invitation is sent
          fetchInvitations();
        }}
      />
    </>
  );
};

export default WorkspaceMembersModal;
