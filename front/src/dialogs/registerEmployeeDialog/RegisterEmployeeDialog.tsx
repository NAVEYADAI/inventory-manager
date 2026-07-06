import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Tabs,
  Tab,
  Autocomplete,
  Typography,
  Paper
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import BaseDialog from '../../components/BaseDialog/BaseDialog';
import axiosInstance from '../../api/axiosInstance';
import { UI_STRINGS } from '../../constants/uiStrings';

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: number;
  onSave: () => void;
  currentEmployees?: any[];
}

const RegisterEmployeeDialog = ({ open, onClose, companyId, onSave, currentEmployees = [] }: Props) => {
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;
  const userRole = userObj?.selectedCompany?.role;

  const [tabValue, setTabValue] = useState(0); // 0 = Add Existing, 1 = Register New
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);

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

  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        setUsersLoading(true);
        try {
          const response = await axiosInstance.get('/user');
          setAllUsers(response.data);
        } catch (err) {
          console.error('Failed to fetch users', err);
        } finally {
          setUsersLoading(false);
        }
      };
      fetchUsers();
    }
  }, [open]);

  // Filter out users already in the current company
  const currentEmployeeIds = new Set((currentEmployees || []).map((emp: any) => emp.user?.id));
  const availableUsers = allUsers.filter((u: any) => !currentEmployeeIds.has(u.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tabValue === 0) {
      if (!selectedUser) {
        setError('נא לבחור משתמש מהרשימה');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        await axiosInstance.post(`/company/${companyId}/employees`, {
          name: selectedUser.name,
          email: selectedUser.email,
          role,
        });
        onSave();
        handleClose();
      } catch (err: any) {
        setError(err.response?.data?.message || 'שגיאה בהוספת המשתמש לחברה. ייתכן שהוא כבר רשום.');
      } finally {
        setIsLoading(false);
      }
    } else {
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
    setSelectedUser(null);
    setTabValue(0);
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
        {isLoading ? <CircularProgress size={24} color="inherit" /> : (tabValue === 0 ? UI_STRINGS.employees.addEmployee : 'רשום עובד')}
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
      title="רישום והוספת עובדים"
      subtitle="הוספת משתמש קיים או רישום משתמש חדש לחברה"
      icon={<BadgeIcon />}
      actions={actions}
      onSubmit={handleSubmit}
      maxWidth="sm"
    >
      <Stack spacing={2.5}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => {
              setTabValue(newValue);
              setError(null);
            }}
            variant="fullWidth"
          >
            <Tab label="הוספת משתמש קיים" />
            <Tab label="רישום משתמש חדש" />
          </Tabs>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {tabValue === 0 ? (
          <Stack spacing={2.5}>
            {usersLoading ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Autocomplete
                options={availableUsers}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.name}) - ${option.email}`}
                value={selectedUser}
                onChange={(_, newValue) => {
                  setSelectedUser(newValue);
                  setError(null);
                }}
                noOptionsText="לא נמצאו משתמשים מתאימים במערכת"
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props as any;
                  return (
                    <Box component="li" key={option.id} {...optionProps} sx={{ p: 1.5 }}>
                      <Stack spacing={0.5}>
                        <Typography variant="body1" fontWeight={600}>
                          {option.firstName} {option.lastName} ({option.name})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.email} {option.phone ? `| ${option.phone}` : ''}
                        </Typography>
                      </Stack>
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="חפש משתמש קיים (לפי שם או אימייל)"
                    required
                    placeholder={UI_STRINGS.employees.searchPlaceholder}
                  />
                )}
              />
            )}

            {selectedUser && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                  פרטי המשתמש שנבחר:
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">שם מלא</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedUser.firstName} {selectedUser.lastName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">שם משתמש</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedUser.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">אימייל</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedUser.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">טלפון</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedUser.phone || '-'}</Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            <FormControl fullWidth>
              <InputLabel id="role-select-label">{UI_STRINGS.employees.roleLabel}</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label={UI_STRINGS.employees.roleLabel}
                onChange={(e) => setRole(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {userRole === 'owner' && (
                  <MenuItem value="admin">מנהל חברה (Admin)</MenuItem>
                )}
                <MenuItem value="editor">{UI_STRINGS.employees.roleEditor}</MenuItem>
                <MenuItem value="viewer">צופה (Viewer)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
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
                <InputLabel id="role-select-label-new">{UI_STRINGS.employees.roleLabel}</InputLabel>
                <Select
                  labelId="role-select-label-new"
                  value={role}
                  label={UI_STRINGS.employees.roleLabel}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {userRole === 'owner' && (
                    <MenuItem value="admin">מנהל חברה (Admin)</MenuItem>
                  )}
                  <MenuItem value="editor">עובד (Editor)</MenuItem>
                  <MenuItem value="viewer">צופה (Viewer)</MenuItem>
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
        )}
      </Stack>
    </BaseDialog>
  );
};

export default RegisterEmployeeDialog;
