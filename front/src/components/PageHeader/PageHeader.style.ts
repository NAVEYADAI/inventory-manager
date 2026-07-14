import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export type HeaderTheme = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'activity' | 'employees';

const gradients: Record<HeaderTheme, string> = {
  primary: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  secondary: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  success: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  info: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
  warning: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
  activity: "linear-gradient(135deg, #334155 0%, #475569 100%)",
  employees: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",
};

const shadows: Record<HeaderTheme, string> = {
  primary: "0 10px 25px -5px rgba(30, 60, 114, 0.15)",
  secondary: "0 10px 25px -5px rgba(79, 70, 229, 0.15)",
  success: "0 10px 25px -5px rgba(5, 150, 105, 0.15)",
  info: "0 10px 25px -5px rgba(13, 148, 136, 0.15)",
  warning: "0 10px 25px -5px rgba(217, 119, 6, 0.15)",
  activity: "0 10px 25px -5px rgba(51, 65, 85, 0.15)",
  employees: "0 10px 25px -5px rgba(219, 39, 119, 0.15)",
};

export const HeaderBanner = styled(Box, {
  shouldForwardProp: (prop) => prop !== "colorTheme",
})<{ colorTheme?: HeaderTheme }>(({ theme, colorTheme }) => ({
  width: "100%",
  borderRadius: "20px",
  background: gradients[colorTheme || "primary"],
  boxShadow: shadows[colorTheme || "primary"],
  padding: "24px 32px",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  marginBottom: "32px",
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "16px",
  },
}));
