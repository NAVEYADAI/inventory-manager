import { styled } from "@mui/material/styles";
import { Box, Paper, Card } from "@mui/material";

export const RecipesContainer = styled(Box)(() => ({
  padding: "32px",
  maxWidth: "1200px",
  margin: "0 auto",
}));

export const RecipesHeader = styled(Paper)(() => ({
  padding: "24px",
  marginBottom: "32px",
  borderRadius: "24px",
  color: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #673ab7 100%)",
  boxShadow: "0 4px 20px rgba(25, 118, 210, 0.15)",
}));

export const RecipeCard = styled(Card)(() => ({
  height: "340px",
  display: "flex",
  flexDirection: "column",
  borderRadius: "24px",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
}));

export const IngredientList = styled(Box)(() => ({
  flexGrow: 1,
  overflowY: "auto",
  maxHeight: "190px",
  paddingRight: "4px",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#cbd5e1",
    borderRadius: "2px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#94a3b8",
  },
}));

export const IngredientItem = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 12px",
  borderRadius: "12px",
  backgroundColor: "rgba(0, 0, 0, 0.04)",
  marginBottom: "8px",
}));
