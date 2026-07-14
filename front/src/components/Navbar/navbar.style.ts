import React from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, ListItem, ListItemButton, Chip, MenuItem, Divider } from "@mui/material";

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  margin: "20px auto 0",
  maxWidth: "1200px",
  width: "calc(100% - 40px)",
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
  color: "#1e293b",
  top: "20px",
  zIndex: 1100,
  [theme.breakpoints.down("sm")]: {
    margin: "10px auto 0",
    width: "calc(100% - 20px)",
    top: "10px",
  },
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: "space-between",
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));

export const LogoImage = styled("img")(() => ({
  height: 38,
  width: "auto",
  filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))",
}));

export const BrandTitle = styled(Typography)(() => ({
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e3c72 0%, #673ab7 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.5px",
}));

export const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ component?: React.ElementType; to?: string; active?: boolean }>(({ theme, active }) => ({
  fontWeight: active ? 700 : 500,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderRadius: "10px",
  textTransform: "none",
  color: active ? "#1e3c72" : "#64748b",
  backgroundColor: active ? "rgba(30, 60, 114, 0.08)" : "transparent",
  "&:hover": {
    backgroundColor: active
      ? "rgba(30, 60, 114, 0.12)"
      : "rgba(0, 0, 0, 0.03)",
  },
  "& .MuiButton-endIcon": {
    marginRight: "-4px",
    marginLeft: "4px",
  },
}));

export const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const UsernameText = styled(Typography)(() => ({
  color: "#475569",
  fontWeight: 600,
  fontSize: "0.9rem",
}));

export const LogoutButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(239, 68, 68, 0.08)",
  color: "#ef4444",
  borderRadius: "10px",
  padding: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    transform: "scale(1.05)",
  },
}));

export const ProfileButton = styled(IconButton)(() => ({
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  color: "#ffffff",
  width: 40,
  height: 40,
  fontSize: "0.95rem",
  fontWeight: 700,
  boxShadow: "0 4px 10px rgba(30, 60, 114, 0.15)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)",
    transform: "scale(1.05)",
    boxShadow: "0 6px 14px rgba(30, 60, 114, 0.25)",
  },
}));

export const MenuHeaderCard = styled(Box)(({ theme }) => ({
  padding: "16px 20px",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  minWidth: 240,
}));

export const menuPaperProps = {
  elevation: 0,
  sx: {
    mt: 1,
    borderRadius: "14px",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    overflow: "visible",
    background: "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(12px)",
    padding: "4px 0",
    "& .MuiMenuItem-root": {
      fontSize: "0.92rem",
      fontWeight: 500,
      borderRadius: "8px",
      margin: "2px 6px",
      padding: "8px 12px",
      color: "#475569",
      transition: "all 0.15s ease-in-out",
      "&:hover": {
        backgroundColor: "rgba(30, 60, 114, 0.06)",
        color: "#1e3c72",
      },
      "&.Mui-selected": {
        backgroundColor: "rgba(30, 60, 114, 0.08)",
        color: "#1e3c72",
        fontWeight: 700,
      }
    }
  }
};

export const DrawerListItem = styled(ListItem)(() => ({
  marginBottom: "4px",
}));

export const DrawerNavButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ component?: React.ElementType; to?: string; active?: boolean }>(({ active }) => ({
  borderRadius: "10px",
  color: active ? "#1e3c72" : "#64748b",
  backgroundColor: active ? "rgba(30, 60, 114, 0.08)" : "transparent",
  fontWeight: active ? 700 : 500,
  textAlign: "right",
  "&:hover": {
    backgroundColor: active ? "rgba(30, 60, 114, 0.12)" : "rgba(0, 0, 0, 0.03)",
  },
  "&.Mui-selected": {
    backgroundColor: active ? "rgba(30, 60, 114, 0.08)" : "transparent",
    color: "#1e3c72",
    fontWeight: 700,
  }
}));

export const RoleChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "roleType",
})<{ roleType?: string }>(({ roleType }) => {
  const gradients: Record<string, string> = {
    owner: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    admin: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    employee: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  };
  return {
    fontWeight: 700,
    width: "fit-content",
    borderRadius: "8px",
    color: "#ffffff",
    background: gradients[roleType || "employee"],
  };
});

export const ProfileMenuItem = styled(MenuItem)<{ component?: React.ElementType; to?: string }>(() => ({
  display: "flex",
  gap: "12px",
  paddingTop: "8px",
  paddingBottom: "8px",
  "& .MuiSvgIcon-root": {
    color: "#64748b",
  },
}));

export const ProfileLogoutMenuItem = styled(MenuItem)<{ component?: React.ElementType; to?: string }>(() => ({
  display: "flex",
  gap: "12px",
  paddingTop: "8px",
  paddingBottom: "8px",
  color: "#ef4444 !important",
  "&:hover": {
    backgroundColor: "rgba(239, 68, 68, 0.08) !important",
  },
  "& .MuiSvgIcon-root": {
    color: "#ef4444",
  },
}));

export const MenuDivider = styled(Divider)(() => ({
  margin: "8px 0",
  borderColor: "#f1f5f9",
}));

export const MobileMenuButton = styled(IconButton)(() => ({
  color: "#1e3c72",
}));

export const drawerPaperProps = {
  sx: {
    width: 280,
    direction: "rtl" as const,
    padding: "20px",
    background: "rgba(255, 255, 255, 0.97)",
    backdropFilter: "blur(12px)",
  }
};

export const DrawerHeaderCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

export const DrawerHeaderTitle = styled(Typography)(() => ({
  fontWeight: 700,
  color: "#1e3c72",
}));

