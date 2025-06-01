import React from "react";
import { TextField as MuiTextField } from "@mui/material";

const CustomTextField = ({
  label,
  placeholder,
  type = "text",
  variant = "outlined",
  fullWidth = true,
  required = false,
  disabled = false,
  multiline = false,
  rows = 1,
  error = false,
  helperText,
  value,
  onChange,
  sx = {},
  ...props
}) => {
  return (
    <MuiTextField
      label={label}
      placeholder={placeholder}
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      error={error}
      helperText={helperText}
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 1.5,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default CustomTextField;
