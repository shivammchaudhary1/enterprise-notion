import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
  disableBackdropClick = false,
  sx = {},
  ...props
}) => {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === "backdropClick") {
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          ...sx,
        },
      }}
      {...props}
    >
      {title && (
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent>{children}</DialogContent>

      {actions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
};

export default CustomModal;
