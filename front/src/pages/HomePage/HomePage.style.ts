import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Paper, Card, Button } from "@mui/material";

export const HomeContainer = styled(Box)(({ theme }) => ({
  padding: "32px",
  maxWidth: "1200px",
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

export const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: "32px",
  marginBottom: "40px",
  borderRadius: "24px",
  color: "#ffffff",
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #673ab7 100%)",
  boxShadow: "0 8px 30px rgba(30, 60, 114, 0.15)",
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
    marginBottom: "24px",
  },
}));

export const CompanyBadge = styled(Box)(() => ({
  marginTop: "16px",
  display: "inline-block",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  padding: "6px 16px",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(5px)",
}));

export const ShortcutCard = styled(Card)(() => ({
  height: "100%",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
}));

export const ShortcutButton = styled(Button)<{ component?: React.ElementType; to?: string }>(() => ({
  borderRadius: "10px",
  fontWeight: 700,
  marginTop: "8px",
  padding: "8px 16px",
}));
