import React from "react";
import { Button as MuiButton } from "@mui/material";

const CustomButton = ({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  onClick,
  startIcon,
  endIcon,
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderRadius: 1.5,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default CustomButton;
