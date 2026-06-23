import { styled } from "@mui/material/styles";
import { Box, Paper, Card, Button } from "@mui/material";

export const TagsContainer = styled(Box)(({ theme }) => ({
  padding: "32px",
  maxWidth: "1200px",
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

export const TagsHeader = styled(Paper)(({ theme }) => ({
  padding: "24px",
  marginBottom: "32px",
  borderRadius: "24px",
  color: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
  background: "linear-gradient(135deg, #7b1fa2 0%, #4a148c 50%, #1a237e 100%)",
  boxShadow: "0 4px 20px rgba(123, 31, 162, 0.15)",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
    flexDirection: "column",
    alignItems: "stretch",
    textAlign: "center",
  },
}));

export const TagCard = styled(Card)(() => ({
  height: "220px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "24px",
  transition: "transform 0.2s, box-shadow 0.2s",
  padding: "20px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
}));

export const CreateTagButton = styled(Button)(() => ({
  borderRadius: "12px",
  fontWeight: 700,
  padding: "10px 24px",
  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
}));
