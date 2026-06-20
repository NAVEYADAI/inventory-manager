import { styled } from "@mui/material/styles";
import { Typography, Box, Alert, Grid } from "@mui/material";
import TextInput from "../../components/Inputs/TextInput";
import { ActionButton } from "../LoginAndSignin/LoginAndSignin.style";

export const BannerTitle = styled(Typography)(() => ({
  letterSpacing: "0.5px",
}));

export const BannerDescription = styled(Typography)(() => ({
  opacity: 0.9,
  maxWidth: "340px",
  lineHeight: 1.7,
  fontSize: "1.05rem",
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3.5),
}));

export const FormHeader = styled(Box)(() => ({
  textAlign: "center",
}));

export const FormGridContainer = styled(Grid)(() => ({
  width: "100% !important",
}));

export const StyledTextInput = styled(TextInput)(() => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
}));

export const ErrorAlert = styled(Alert)(() => ({
  width: "100%",
  borderRadius: "12px",
  paddingTop: "4px",
  paddingBottom: "4px",
}));

export const SubmitButton = styled(ActionButton)(() => ({
  marginTop: "12px",
  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
  color: "#ffffff",
}));
