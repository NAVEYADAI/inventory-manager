import { styled } from "@mui/material/styles";
import { Typography, Box, Alert, Stack, Paper, Button } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";

export const HeaderIcon = styled(BusinessIcon)(() => ({
  fontSize: 60,
  opacity: 0.9,
}));

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
  height: "100%",
  justifyContent: "center",
}));

export const FormHeader = styled(Box)(() => ({
  textAlign: "center",
}));

export const ErrorAlert = styled(Alert)(() => ({
  borderRadius: "12px",
  paddingTop: "4px",
  paddingBottom: "4px",
}));

export const ScrollableStack = styled(Stack)(() => ({
  overflowY: "auto",
  paddingRight: "4px",
  maxHeight: "350px",
}));

export const SectionSubtitle = styled(Typography)(() => ({
  marginBottom: "8px",
}));

export const ActiveCompanyPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  borderRadius: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const InactiveCompanyPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  borderRadius: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderColor: theme.palette.warning.light,
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: (theme.palette as any).warning?.lighter || "rgba(255, 152, 0, 0.08)",
  },
}));

export const PickerButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontWeight: 700,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const CreateCompanyButton = styled(Button)(() => ({
  borderRadius: '12px',
  paddingTop: '10px',
  paddingBottom: '10px',
  fontWeight: 700,
  borderWidth: '2px',
  borderColor: '#1e3c72',
  color: '#1e3c72',
  '&:hover': {
    borderWidth: '2px',
    borderColor: '#2a5298',
    backgroundColor: 'rgba(30, 60, 114, 0.04)',
  }
}));

export const CancelButton = styled(Button)(() => ({
  fontWeight: 600,
  color: '#64748b',
}));
