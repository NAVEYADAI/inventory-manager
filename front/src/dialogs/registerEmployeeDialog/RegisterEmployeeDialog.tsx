import React, { useState } from 'react';
import {
  Button,
  Box,
  Stack,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import BaseDialog from '../../components/BaseDialog/BaseDialog';
import axiosInstance from '../../api/axiosInstance';
import { UI_STRINGS } from '../../constants/uiStrings';
import Input from '../../components/Inputs/Input';

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: number;
  onSave: () => void;
  currentEmployees?: any[];
}

const RegisterEmployeeDialog = ({ open, onClose, companyId, onSave }: Props) => {
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;
  const userRole = userObj?.selectedCompany?.role;

  const [tabValue, setTabValue] = useState(0); // 0 = Add Existing, 1 = Register New
  const [existingIdentifier, setExistingIdentifier] = useState('');

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    role: 'editor',
    tz: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof formData) => (e: any) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tabValue === 0) {
      if (!existingIdentifier.trim()) {
        setError('נא להזין שם משתמש או תעודת זהות');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        await axiosInstance.post(`/company/${companyId}/employees`, {
          identifier: existingIdentifier.trim(),
          role: formData.role,
        });
        onSave();
        handleClose();
      } catch (err: any) {
        setError(err.response?.data?.message || 'שגיאה בהוספת המשתמש לחברה. ייתכן שהוא כבר רשום או שאינו קיים.');
      } finally {
        setIsLoading(false);
      }
    } else {
      const requiredKeys: Array<keyof typeof formData> = ['userName', 'password', 'email', 'firstName', 'lastName', 'tz'];
      const hasAllRequired = requiredKeys.every((key) => !!formData[key].trim());
      if (!hasAllRequired) {
        setError('נא למלא את כל שדות החובה (*)');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { userName: name, ...rest } = formData;
        await axiosInstance.post(`/company/${companyId}/employees`, {
          name,
          ...rest,
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
    setFormData({
      userName: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      role: 'editor',
      tz: '',
    });
    setExistingIdentifier('');
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
          color: '#ffffff',
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
            <Input
              required
              fullWidth
              label="שם משתמש או תעודת זהות של העובד"
              placeholder="הזן את שם המשתמש או תעודת הזהות של העובד הקיים במערכת"
              state={existingIdentifier}
              setState={(val) => {
                setExistingIdentifier(val);
                setError(null);
              }}
            />

            <Input
              type="select"
              label={UI_STRINGS.employees.roleLabel}
              state={formData.role}
              setState={(val) => setFormData((prev) => ({ ...prev, role: val }))}
              options={[
                ...(userRole === 'owner' ? [{ label: 'מנהל חברה (Admin)', value: 'admin' }] : []),
                { label: UI_STRINGS.employees.roleEditor, value: 'editor' },
                { label: 'צופה (Viewer)', value: 'viewer' },
              ]}
              fullWidth
            />
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Box display="flex" gap={2}>
              <Input
                required
                fullWidth
                label="שם משתמש"
                state={formData.userName}
                setState={(val) => setFormData((prev) => ({ ...prev, userName: val }))}
              />
              <Input
                required
                fullWidth
                type="password"
                label="סיסמה"
                state={formData.password}
                setState={(val) => setFormData((prev) => ({ ...prev, password: val }))}
              />
            </Box>

            <Box display="flex" gap={2}>
              <Input
                required
                fullWidth
                label="שם פרטי"
                state={formData.firstName}
                setState={(val) => setFormData((prev) => ({ ...prev, firstName: val }))}
              />
              <Input
                required
                fullWidth
                label="שם משפחה"
                state={formData.lastName}
                setState={(val) => setFormData((prev) => ({ ...prev, lastName: val }))}
              />
            </Box>

            <Box display="flex" gap={2}>
              <Input
                required
                fullWidth
                label="תעודת זהות"
                state={formData.tz}
                setState={(val) => {
                  setFormData((prev) => ({ ...prev, tz: val }));
                  setError(null);
                }}
              />
              <Input
                required
                fullWidth
                type="email"
                label="כתובת אימייל"
                state={formData.email}
                setState={(val) => setFormData((prev) => ({ ...prev, email: val }))}
              />
            </Box>

            <Box display="flex" gap={2}>
              <Input
                fullWidth
                label="טלפון"
                state={formData.phone}
                setState={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
              />
              <Input
                type="select"
                label={UI_STRINGS.employees.roleLabel}
                state={formData.role}
                setState={(val) => setFormData((prev) => ({ ...prev, role: val }))}
                options={[
                  ...(userRole === 'owner' ? [{ label: 'מנהל חברה (Admin)', value: 'admin' }] : []),
                  { label: 'עובד (Editor)', value: 'editor' },
                  { label: 'צופה (Viewer)', value: 'viewer' },
                ]}
                fullWidth
              />
            </Box>

            <Input
              fullWidth
              label="כתובת מגורים"
              state={formData.address}
              setState={(val) => setFormData((prev) => ({ ...prev, address: val }))}
            />
          </Stack>
        )}
      </Stack>
    </BaseDialog>
  );
};

export default RegisterEmployeeDialog;
