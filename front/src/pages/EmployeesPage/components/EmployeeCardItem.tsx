import React from 'react';
import { CardContent, Box, Typography, Divider, Stack, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { EmployeeCard, AvatarWrapper } from '../EmployeesPage.style';

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
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const EmployeeCardItem: React.FC<EmployeeCardItemProps> = ({ employeePermission }) => {
  const { user: employee, role } = employeePermission;
  const isEmpAdmin = role === 'admin';

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

          <Chip
            label={isEmpAdmin ? 'מנהל חברה' : 'עובד'}
            size="small"
            sx={{
              fontWeight: 700,
              borderRadius: '8px',
              color: '#ffffff',
              background: isEmpAdmin
                ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: isEmpAdmin
                ? '0 2px 8px rgba(99, 102, 241, 0.2)'
                : '0 2px 8px rgba(16, 185, 129, 0.2)',
            }}
          />
        </Box>
      </CardContent>
    </EmployeeCard>
  );
};

export default EmployeeCardItem;
