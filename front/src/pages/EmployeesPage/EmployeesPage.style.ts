import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Paper, Button } from '@mui/material';

export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

export const EmployeeCard = styled(Card)(() => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  border: '1px solid #f1f5f9',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.06)',
  },
}));

export const AvatarWrapper = styled(Avatar)(() => ({
  width: 56,
  height: 56,
  fontSize: '1.25rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
}));

export const AccessDeniedWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: '24px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
  border: '1px solid #f1f5f9',
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

export const AddEmployeeButton = styled(Button)(() => ({
  borderRadius: '12px',
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingTop: '10px',
  paddingBottom: '10px',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
  boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #3730a3 0%, #312e81 100%)',
  },
}));

export const CancelEmployeeButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  fontWeight: 700,
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
}));
