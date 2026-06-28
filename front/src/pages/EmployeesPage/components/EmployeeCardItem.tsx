import React, { useState } from 'react';
import { CardContent, Box, Typography, Divider, Stack, Chip, IconButton, Select, MenuItem, FormControl, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { EmployeeCard, AvatarWrapper } from '../EmployeesPage.style';
import { updateEmployeeRole, removeEmployee } from '../../../api/company';

interface EmployeePermission {
  id: number;
  role: string;
  user: {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface EmployeeCardItemProps {
  employeePermission: EmployeePermission;
  onRoleUpdated: () => void;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const EmployeeCardItem: React.FC<EmployeeCardItemProps> = ({ employeePermission, onRoleUpdated }) => {
  const { user: employee, role } = employeePermission;
  const [isEditing, setIsEditing] = useState(false);
  const [editedRole, setEditedRole] = useState(role);
  const [isUpdating, setIsUpdating] = useState(false);

  const userStr = localStorage.getItem('user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const loggedInUserRole = loggedInUser?.selectedCompany?.role;
  const loggedInUserId = loggedInUser?.id;

  const isOwnCard = loggedInUserId === employee.id;
  const canEdit = !isOwnCard && (
    loggedInUserRole === 'owner' && role !== 'owner' ||
    loggedInUserRole === 'admin' && (role === 'editor' || role === 'viewer')
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'בעלים';
      case 'admin':
        return 'מנהל חברה';
      case 'viewer':
        return 'צופה';
      default:
        return 'עובד';
    }
  };

  const getRoleBackground = (role: string) => {
    switch (role) {
      case 'owner':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'admin':
        return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
      case 'viewer':
        return 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
      default:
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    }
  };

  const handleSaveRole = async () => {
    if (!loggedInUser?.selectedCompany?.id) return;
    setIsUpdating(true);
    try {
      await updateEmployeeRole(loggedInUser.selectedCompany.id, employee.id, editedRole);
      onRoleUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update employee role', error);
      setEditedRole(role);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!loggedInUser?.selectedCompany?.id) return;
    if (!window.confirm(`האם אתה בטוח שברצונך להסיר את ${employee.firstName} ${employee.lastName} מהחברה?`)) {
      return;
    }
    setIsUpdating(true);
    try {
      await removeEmployee(loggedInUser.selectedCompany.id, employee.id);
      onRoleUpdated();
    } catch (error) {
      console.error('Failed to remove employee', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <EmployeeCard>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2.5}>
          <AvatarWrapper>
            {getInitials(employee.firstName, employee.lastName)}
          </AvatarWrapper>
          <Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              שם משתמש: {employee.name}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5} sx={{ mb: 2.5 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-all' }}>
              {employee.email}
            </Typography>
          </Box>

          {employee.phone && (
            <Box display="flex" alignItems="center" gap={1.5}>
              <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="body2" color="text.primary">
                {employee.phone}
              </Typography>
            </Box>
          )}

          {employee.address && (
            <Box display="flex" alignItems="center" gap={1.5}>
              <HomeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="body2" color="text.primary">
                {employee.address}
              </Typography>
            </Box>
          )}
        </Stack>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.5}>
            <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            <Typography variant="caption" color="text.secondary">
              מזהה: #{employee.id}
            </Typography>
          </Box>

          {isEditing ? (
            <Box display="flex" alignItems="center" gap={1}>
              {isUpdating ? (
                <CircularProgress size={20} color="secondary" />
              ) : (
                <>
                  <IconButton size="small" color="success" onClick={handleSaveRole}>
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => { setIsEditing(false); setEditedRole(role); }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              )}
              <FormControl size="small" variant="standard">
                <Select
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value as string)}
                  sx={{ fontSize: '0.8125rem', fontWeight: 700, pb: 0.25 }}
                  disabled={isUpdating}
                >
                  {loggedInUserRole === 'owner' && (
                    <MenuItem value="admin" sx={{ fontSize: '0.8125rem' }}>מנהל חברה</MenuItem>
                  )}
                  <MenuItem value="editor" sx={{ fontSize: '0.8125rem' }}>עובד</MenuItem>
                  <MenuItem value="viewer" sx={{ fontSize: '0.8125rem' }}>צופה</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              {canEdit && (
                <>
                  <IconButton
                    size="small"
                    onClick={() => setIsEditing(true)}
                    sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleDeleteEmployee}
                    sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
              <Chip
                label={getRoleLabel(role)}
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: '8px',
                  color: '#ffffff',
                  background: getRoleBackground(role),
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </EmployeeCard>
  );
};

export default EmployeeCardItem;
