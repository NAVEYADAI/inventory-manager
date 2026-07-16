import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Button } from '@mui/material';

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#f8fafc',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

export const ContentWrapper = styled(Box)({
  width: '100%',
  maxWidth: '1200px',
});

export const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: '100%',
  maxWidth: '500px',
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  border: '1px solid #e2e8f0',
}));

export const EmptyStateIconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: '#f0fdf4',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)',
}));

export const PreparationCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSuccess',
})<{ isSuccess?: boolean }>(({ isSuccess }) => ({
  borderRadius: '16px',
  border: isSuccess ? '2px solid #22c55e' : '1px solid #e2e8f0',
  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06)',
  },
  backgroundColor: isSuccess ? '#f0fdf4' : '#ffffff',
}));

export const RecipeIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSuccess',
})<{ isSuccess?: boolean }>(({ isSuccess }) => ({
  width: 42,
  height: 42,
  borderRadius: '10px',
  backgroundColor: isSuccess ? '#dcfce7' : '#eff6ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const InfoContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  padding: theme.spacing(2),
  borderRadius: '12px',
}));

export const SuccessIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  color: '#22c55e',
}));

export const SaveButton = styled(Button)(({ theme }) => ({
  height: '42px',
  borderRadius: '10px',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  fontWeight: 700,
  color: '#ffffff !important',
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  boxShadow: '0 4px 10px rgba(30, 60, 114, 0.25)',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.7) !important',
    background: 'rgba(30, 60, 114, 0.5) !important',
    boxShadow: 'none',
  },
}));

export const TitleTextWrapper = styled(Box)({
  minWidth: 0,
  flex: 1,
});
