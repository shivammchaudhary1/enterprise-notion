import React from "react";
import {
  Card as MuiCard,
  CardContent,
  CardActions,
  CardHeader,
} from "@mui/material";

const CustomCard = ({
  children,
  title,
  subtitle,
  actions,
  elevation = 1,
  sx = {},
  contentSx = {},
  ...props
}) => {
  return (
    <MuiCard
      elevation={elevation}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        ...sx,
      }}
      {...props}
    >
      {title && (
        <CardHeader
          title={title}
          subheader={subtitle}
          sx={{
            "& .MuiCardHeader-title": {
              fontSize: "1.25rem",
              fontWeight: 600,
            },
            "& .MuiCardHeader-subheader": {
              fontSize: "0.875rem",
              color: "text.secondary",
            },
          }}
        />
      )}

      <CardContent sx={contentSx}>{children}</CardContent>

      {actions && <CardActions sx={{ px: 2, pb: 2 }}>{actions}</CardActions>}
    </MuiCard>
  );
};

export default CustomCard;
