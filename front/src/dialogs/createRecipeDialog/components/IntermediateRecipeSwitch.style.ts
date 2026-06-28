import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface StyledBoxProps {
  checked: boolean;
}

export const SwitchContainerBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'checked',
})<StyledBoxProps>(({ checked }) => ({
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: checked ? 'rgba(156, 39, 176, 0.04)' : '#f8fafc',
  border: '1px solid',
  borderColor: checked ? 'rgba(156, 39, 176, 0.2)' : '#e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease-in-out',
  marginTop: '-8px',
  marginBottom: '8px',
}));
