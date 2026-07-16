import { styled } from '@mui/material/styles';
import { Box, Paper, Container, ToggleButtonGroup, Stack, Chip, TableRow, TableCell } from '@mui/material';

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
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
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
  },
}));

export const LockIconContainer = styled(Box)(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: '20px',
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  boxShadow: '0 10px 20px rgba(239, 68, 68, 0.15)',
}));

export const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
  border: '1px solid #e2e8f0',
}));

export const SearchWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.up('sm')]: {
    maxWidth: 400,
  },
}));

export const FilterToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  border: 'none',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-start',
  },
  '& .MuiToggleButton-root': {
    borderRadius: '10px !important',
    border: '1px solid #e2e8f0 !important',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontWeight: 700,
    color: '#64748b',
    margin: '0 !important',
    '&.Mui-selected': {
      color: '#ffffff',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      '&:hover': {
        background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
      },
    },
  },
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
}));

export const EmptyStatePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  textAlign: 'center',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
}));

export const LogCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.01)',
  backgroundColor: '#ffffff',
}));

export const MobileLogStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

export const LogTableContainer = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  width: '100%',
  overflowX: 'auto',
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));

// Chips
export const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'isEmployeeCat',
})<{ isEmployeeCat?: boolean }>(({ isEmployeeCat }) => ({
  fontWeight: 700,
  borderRadius: '8px',
  color: isEmployeeCat ? '#7c3aed' : '#2563eb',
  backgroundColor: isEmployeeCat ? '#f5f3ff' : '#eff6ff',
  border: `1px solid ${isEmployeeCat ? '#ddd6fe' : '#bfdbfe'}`,
}));

export const ActionChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'actionColor',
})<{ actionColor?: string }>(({ actionColor }) => ({
  fontWeight: 700,
  borderRadius: '8px',
  color: '#ffffff',
  backgroundColor: actionColor || '#64748b',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

// Table Row & Cells
export const LogTableRow = styled(TableRow)(() => ({
  '&:hover': { backgroundColor: '#f8fafc' },
  transition: 'background-color 0.2s',
}));

export const HeaderCell = styled(TableCell)(() => ({
  fontWeight: 800,
  color: '#475569',
}));

export const DateCell = styled(TableCell)(() => ({
  whiteSpace: 'nowrap',
  color: '#475569',
}));

export const UserCell = styled(TableCell)(() => ({
  fontWeight: 600,
  color: '#1e293b',
}));

export const DetailsCell = styled(TableCell)(() => ({
  color: '#334155',
  fontWeight: 500,
}));
