import { Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PremiumAlert = styled(Alert)(({ severity }) => {
  const colors = {
    success: {
      background: 'rgba(236, 253, 245, 0.9)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      text: '#065f46',
      icon: '#10b981',
      shadow: 'rgba(16, 185, 129, 0.1)',
    },
    error: {
      background: 'rgba(254, 242, 242, 0.9)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      text: '#991b1b',
      icon: '#ef4444',
      shadow: 'rgba(239, 68, 68, 0.1)',
    },
    warning: {
      background: 'rgba(255, 251, 235, 0.9)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      text: '#92400e',
      icon: '#f59e0b',
      shadow: 'rgba(245, 158, 11, 0.1)',
    },
    info: {
      background: 'rgba(239, 246, 255, 0.9)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      text: '#1e40af',
      icon: '#3b82f6',
      shadow: 'rgba(59, 130, 246, 0.1)',
    },
  };

  const current = colors[(severity || 'info') as keyof typeof colors];

  return {
    backgroundColor: current.background,
    border: current.border,
    color: current.text,
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
    boxShadow: `0 10px 25px -5px ${current.shadow}, 0 8px 10px -6px ${current.shadow}`,
    padding: '12px 24px',
    minWidth: '320px',
    maxWidth: '500px',
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: '"Inter", "Roboto", "Outfit", sans-serif',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease-in-out',
    '& .MuiAlert-icon': {
      color: current.icon,
      fontSize: '24px',
      marginRight: 0,
      marginLeft: '12px', // spacing for RTL
    },
    '& .MuiAlert-message': {
      textAlign: 'right',
      width: '100%',
    },
    '& .MuiAlertTitle-root': {
      fontWeight: 800,
      marginBottom: '2px',
      fontSize: '1.05rem',
      color: current.text,
    }
  };
});
