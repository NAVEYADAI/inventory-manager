import { styled } from "@mui/material/styles";
import { Box, Card } from "@mui/material";

export const HomeContainer = styled(Box)(({ theme }) => ({
  padding: "24px",
  maxWidth: "1200px",
  margin: "0 auto",
  height: "calc(100vh - 100px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "24px",
  boxSizing: "border-box",
  [theme.breakpoints.down("md")]: {
    height: "auto",
    padding: "16px",
    gap: "16px",
  },
}));

export const CompactWelcome = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  boxShadow: "0 10px 25px -5px rgba(30, 60, 114, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  color: "#ffffff",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
  },
}));

export const TileCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "colorTheme",
})<{ colorTheme?: string }>(({ colorTheme }) => {
  const gradients: Record<string, string> = {
    primary: "linear-gradient(135deg, rgba(30, 60, 114, 0.03) 0%, rgba(42, 82, 152, 0.06) 100%)",
    secondary: "linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(124, 58, 237, 0.06) 100%)",
    success: "linear-gradient(135deg, rgba(5, 150, 105, 0.03) 0%, rgba(16, 185, 129, 0.06) 100%)",
    info: "linear-gradient(135deg, rgba(13, 148, 136, 0.03) 0%, rgba(6, 182, 212, 0.06) 100%)",
    warning: "linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, rgba(245, 158, 11, 0.06) 100%)",
    activity: "linear-gradient(135deg, rgba(51, 65, 85, 0.03) 0%, rgba(71, 85, 105, 0.06) 100%)",
    employees: "linear-gradient(135deg, rgba(219, 39, 119, 0.03) 0%, rgba(236, 72, 153, 0.06) 100%)",
  };
  const borders: Record<string, string> = {
    primary: "rgba(30, 60, 114, 0.12)",
    secondary: "rgba(79, 70, 229, 0.12)",
    success: "rgba(5, 150, 105, 0.12)",
    info: "rgba(13, 148, 136, 0.12)",
    warning: "rgba(217, 119, 6, 0.12)",
    activity: "rgba(51, 65, 85, 0.12)",
    employees: "rgba(219, 39, 119, 0.12)",
  };
  const hoverBorders: Record<string, string> = {
    primary: "#1e3c72",
    secondary: "#4f46e5",
    success: "#059669",
    info: "#0d9488",
    warning: "#d97706",
    activity: "#334155",
    employees: "#db2777",
  };

  const themeKey = colorTheme || "primary";

  return {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "16px",
    background: gradients[themeKey],
    border: `1px solid ${borders[themeKey]}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "16px",
    boxSizing: "border-box",
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: "none",
    transition: "all 0.2s ease-in-out",
    "& .MuiSvgIcon-root": {
      color: hoverBorders[themeKey],
      transition: "transform 0.2s ease-in-out, color 0.2s ease-in-out",
    },
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.04)",
      borderColor: hoverBorders[themeKey],
      background: gradients[themeKey].replace("0.03", "0.06").replace("0.06", "0.1"),
      "& .MuiSvgIcon-root": {
        transform: "scale(1.1)",
      },
    },
  };
});
