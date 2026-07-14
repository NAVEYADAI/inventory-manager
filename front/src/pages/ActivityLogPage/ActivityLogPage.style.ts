import { styled } from '@mui/material/styles';
import { Box, Paper, TableContainer } from '@mui/material';

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

export const LogTableContainer = styled(TableContainer)(() => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
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
