import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: "error" | "warning" | "info";
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "אישור",
  cancelText = "ביטול",
  severity = "error",
  isLoading = false,
}) => {
  // Determine color and icon based on severity
  let iconColor = "error.main";
  let iconBg = "rgba(239, 68, 68, 0.08)";
  let confirmBtnColor: "error" | "warning" | "primary" = "error";
  let IconComponent = ErrorOutlineRoundedIcon;

  if (severity === "warning") {
    iconColor = "warning.main";
    iconBg = "rgba(245, 158, 11, 0.08)";
    confirmBtnColor = "warning";
    IconComponent = WarningRoundedIcon;
  } else if (severity === "info") {
    iconColor = "primary.main";
    iconBg = "rgba(59, 130, 246, 0.08)";
    confirmBtnColor = "primary";
    IconComponent = InfoRoundedIcon;
  }

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 1.5,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      {/* Header and Icon */}
      <Box display="flex" alignItems="flex-start" gap={2} sx={{ p: 2, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "12px",
            backgroundColor: iconBg,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          <IconComponent sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ flexGrow: 1, pr: 0.5 }}>
          <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.3 }}>
            {title}
          </Typography>
        </Box>
        {!isLoading && (
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary", mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Content */}
      <DialogContent sx={{ px: 2.5, py: 1 }}>
        <DialogContentText sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.95rem", lineHeight: 1.5 }}>
          {message}
        </DialogContentText>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2, gap: 1, justifyContent: "flex-end" }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "grey.200",
            color: "text.secondary",
            px: 2.5,
            py: 0.75,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              borderColor: "grey.300",
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          color={confirmBtnColor}
          disableElevation
          sx={{
            borderRadius: "10px",
            px: 3,
            py: 0.75,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {isLoading ? "מבצע..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
