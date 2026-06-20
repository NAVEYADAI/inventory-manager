import React from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";

export const StyledAppBar = styled(AppBar)(() => ({
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
}));

export const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRight: "1px solid rgba(0, 0, 0, 0.08)",
  paddingRight: theme.spacing(3),
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
