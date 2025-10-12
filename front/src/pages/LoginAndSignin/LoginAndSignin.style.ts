import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const LoginAndSigninContainer = styled('div')(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f5f5f5",
  padding: "20px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: "10px",
  },
}));

export const SideContainer = styled('div')(({ theme }) => ({
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

export const StyledForm = styled('form')(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  maxWidth: "400px",
  background: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  margin: "10px",
  [theme.breakpoints.down("sm")]: {
    padding: "15px",
  },
  "& > *": {
    marginBottom: "15px",
  },
}));