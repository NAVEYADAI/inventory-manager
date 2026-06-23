import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
} from "@mui/material";

interface BaseDialogProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  actions,
  maxWidth = "sm",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
        }
      }}
    >
      {/* Title */}
      <DialogTitle sx={{ fontWeight: 800, py: 2.5, px: 3, display: "flex", alignItems: "center", gap: 2 }}>
        {icon && React.isValidElement(icon) ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "12px",
              backgroundColor: "rgba(25, 118, 210, 0.09)",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {React.cloneElement(icon as React.ReactElement<any>, {
              sx: { fontSize: 26, color: "inherit" }
            })}
          </Box>
        ) : icon}
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.01em" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ display: "block", mt: 0.5, fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.06)" }} />

      {/* Content */}
      <DialogContent sx={{ p: 3, backgroundColor: "#ffffff" }}>
        {children}
      </DialogContent>

      {/* Actions */}
      {actions && (
        <>
          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.06)" }} />
          <DialogActions sx={{ p: 2.5, px: 3, backgroundColor: "#f8fafc" }}>
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default BaseDialog;
