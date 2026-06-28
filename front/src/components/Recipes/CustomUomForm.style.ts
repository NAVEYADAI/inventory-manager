import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

export const FormGridContainer = styled(Grid)(() => ({
  marginTop: '12px',
  padding: '12px',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  border: '1px dashed #cbd5e1',
  width: '100%',
  boxSizing: 'border-box',
}));

export const ActionsGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '8px',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-end',
  },
}));
