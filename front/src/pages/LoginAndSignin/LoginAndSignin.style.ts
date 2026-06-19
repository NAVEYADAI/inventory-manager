import { styled } from "@mui/material/styles";
import { Button, Paper, Box } from "@mui/material";

export const PageBackground = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  width: "100vw",
  background: "radial-gradient(circle at 10% 20%, rgba(30, 60, 114, 0.95) 0%, rgba(103, 58, 183, 0.95) 50%, rgba(244, 143, 177, 0.95) 100%)",
  padding: "20px",
  boxSizing: "border-box",
  fontFamily: "'Assistant', sans-serif",
}));

export const GlassCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "1000px",
  height: "650px",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    minHeight: "600px",
  },
}));

export const BannerSide = styled(Box)(({ theme }) => ({
  flex: 1,
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #673ab7 100%)",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  textAlign: "center",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.1)",
    pointerEvents: "none",
  },
  [theme.breakpoints.down("md")]: {
    padding: "30px 20px",
    order: 2,
  },
}));

export const FormSide = styled(Box)(({ theme }) => ({
  width: "550px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "50px",
  backgroundColor: "#ffffff",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    padding: "30px 20px",
    order: 1,
  },
}));

export const StyledForm = styled("form")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  alignItems: "center",
});

export const ActionButton = styled(Button)(() => ({
  borderRadius: "12px",
  padding: "10px 24px",
  fontWeight: 700,
  fontSize: "1rem",
  textTransform: "none",
  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

export const GhostButton = styled(Button)({
  borderRadius: "12px",
  padding: "10px 30px",
  fontWeight: 700,
  fontSize: "0.95rem",
  textTransform: "none",
  borderColor: "#ffffff",
  color: "#ffffff",
  borderWidth: "2px",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: "2px",
    transform: "scale(1.03)",
  },
});

// Restored for backwards compatibility with other screens (e.g., CompanySetup)
export const SideContainer = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  backgroundColor: theme.palette.grey[200],
  borderRadius: "8px",
  margin: "10px",
  textAlign: "center",
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  margin: "10px",
  width: "150px",
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));