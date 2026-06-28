import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import BaseDialog from '../../components/BaseDialog/BaseDialog';
import axiosInstance from '../../api/axiosInstance';

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: number;
  onSave: () => void;
}

const RegisterEmployeeDialog = ({ open, onClose, companyId, onSave }: Props) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('editor');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !password || !email || !firstName || !lastName) {
      setError('נא למלא את כל שדות החובה (*)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post(`/company/${companyId}/employees`, {
        name: userName,
        password,
        firstName,
        lastName,
        email,
        phone,
        address,
        role,
      });
      onSave();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'שגיאה ברישום העובד במערכת. ייתכן ששם המשתמש כבר קיים.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUserName('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setRole('editor');
    setError(null);
    onClose();
  };

  const actions = (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        sx={{
          borderRadius: 2,
          px: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3730a3 0%, #312e81 100%)',
          },
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'רשום עובד'}
      </Button>
      <Button
        onClick={handleClose}
        variant="outlined"
        color="inherit"
        sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
      >
        ביטול
      </Button>
    </Box>
  );

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title="רישום עובד חדש"
      subtitle="הגדרת פרטי העובד ומתן הרשאות גישה למערכת"
      icon={<BadgeIcon />}
      actions={actions}
      onSubmit={handleSubmit}
      maxWidth="sm"
    >
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box display="flex" gap={2}>
          <TextField
            required
            fullWidth
            label="שם משתמש"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            slotProps={{ input: { style: { borderRadius: 8 } } }}
          />
          <TextField
            required
            fullWidth
            type="password"
            label="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{ input: { style: { borderRadius: 8 } } }}
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            required
            fullWidth
            label="שם פרטי"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            slotProps={{ input: { style: { borderRadius: 8 } } }}
          />
          <TextField
            required
            fullWidth
            label="שם משפחה"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            slotProps={{ input: { style: { borderRadius: 8 } } }}
          />
        </Box>

        <TextField
          required
          fullWidth
          type="email"
          label="כתובת אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          slotProps={{ input: { style: { borderRadius: 8 } } }}
        />

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="טלפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            slotProps={{ input: { style: { borderRadius: 8 } } }}
          />
          <FormControl fullWidth>
            <InputLabel id="role-select-label">תפקיד במערכת</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              label="תפקיד במערכת"
              onChange={(e) => setRole(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="editor">עובד (Editor)</MenuItem>
              <MenuItem value="admin">מנהל חברה (Admin)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="כתובת מגורים"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          slotProps={{ input: { style: { borderRadius: 8 } } }}
        />
      </Stack>
    </BaseDialog>
  );
};

export default RegisterEmployeeDialog;
