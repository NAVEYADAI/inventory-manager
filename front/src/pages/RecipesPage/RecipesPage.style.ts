import { styled } from "@mui/material/styles";
import { Box, Paper, Card, Button, CardContent, Typography } from "@mui/material";

export const RecipesContainer = styled(Box)(({ theme }) => ({
  padding: "32px",
  maxWidth: "1200px",
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

export const RecipesHeader = styled(Paper)(({ theme }) => ({
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
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
    flexDirection: "column",
    alignItems: "stretch",
    textAlign: "center",
  },
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

export const AddRecipeButton = styled(Button)(() => ({
  borderRadius: "12px",
  fontWeight: 700,
  padding: "10px 24px",
  boxShadow: "0 4px 12px rgba(156, 39, 176, 0.3)",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(156, 39, 176, 0.4)",
  },
}));

export const SearchWrapper = styled(Box)(() => ({
  marginBottom: "32px",
}));

export const EmptyStateWrapper = styled(Paper)(() => ({
  padding: "48px",
  textAlign: "center",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(0, 0, 0, 0.08)",
}));

export const RecipeCardContent = styled(CardContent)(() => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
}));

export const RecipeCardTitle = styled(Typography)(() => ({
  fontWeight: 700,
  maxWidth: "70%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

