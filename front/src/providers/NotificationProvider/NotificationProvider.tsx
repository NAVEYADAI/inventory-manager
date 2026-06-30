import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, AlertTitle, Slide } from '@mui/material';
import { PremiumAlert } from './NotificationProvider.style';

export interface NotificationContextType {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function SlideTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showSuccess = useCallback((msg: string, t?: string) => {
    setMessage(msg);
    setTitle(t);
    setSeverity('success');
    setOpen(true);
  }, []);

  const showError = useCallback((msg: string, t?: string) => {
    setMessage(msg);
    setTitle(t);
    setSeverity('error');
    setOpen(true);
  }, []);

  const showWarning = useCallback((msg: string, t?: string) => {
    setMessage(msg);
    setTitle(t);
    setSeverity('warning');
    setOpen(true);
  }, []);

  const showInfo = useCallback((msg: string, t?: string) => {
    setMessage(msg);
    setTitle(t);
    setSeverity('info');
    setOpen(true);
  }, []);

  const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }, []);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: { xs: 24, sm: 40 } }}
      >
        <PremiumAlert
          onClose={handleClose}
          severity={severity}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </PremiumAlert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
