import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import axiosInstance from '../../api/axiosInstance';
import RegisterEmployeeDialog from '../../dialogs/registerEmployeeDialog/RegisterEmployeeDialog';
import { useNavigate } from 'react-router-dom';
import EmployeeCardItem from './components/EmployeeCardItem';
import { UI_STRINGS } from '../../constants/uiStrings';
import {
  AccessDeniedWrapper,
  CancelEmployeeButton
} from './EmployeesPage.style';
import ThemedPageHeader from '../../components/PageHeader/PageHeader';
import { Button } from '@mui/material';
import { AppRoutes } from '../../routes/routes.enum';



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

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<EmployeePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const navigate = useNavigate();

  // Get active company info from local storage / user state
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const selectedCompany = user?.selectedCompany;
  const companyId = selectedCompany?.id;
  const userRole = selectedCompany?.role;
  const hasAccess = userRole === 'admin' || userRole === 'owner';

  const loadEmployees = async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/company/${companyId}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to load employees', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasAccess && companyId) {
      loadEmployees();
    } else {
      setIsLoading(false);
    }
  }, [companyId, userRole]);

  if (!user || !hasAccess) {
    return (
      <Container maxWidth="lg" dir="rtl">
        <AccessDeniedWrapper variant="outlined">
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '20px',
              bgcolor: 'error.light',
              color: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 10px 20px rgba(239, 68, 68, 0.15)',
            }}
          >
            <LockIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            אין הרשאות גישה
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360 }}>
            דף זה מיועד למנהלי חברה בלבד. לעובדי החברה אין הרשאה לצפות ברשימת העובדים או לרשום עובדים חדשים.
          </Typography>
          <CancelEmployeeButton
            variant="contained"
            onClick={() => navigate(AppRoutes.HOME)}
          >
            חזרה לדף הבית
          </CancelEmployeeButton>
        </AccessDeniedWrapper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" dir="rtl" sx={{ py: 4 }}>
      <ThemedPageHeader
        title={UI_STRINGS.employees.pageTitle}
        subtitle={`${UI_STRINGS.employees.activeCompanyPrefix} ${selectedCompany?.name}`}
        colorTheme="employees"
        icon={<BadgeIcon />}
        action={
          <Button
            variant="contained"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.35)', boxShadow: 'none' },
            }}
            startIcon={<AddIcon sx={{ ml: 1, mr: 0 }} />}
            onClick={() => setIsRegisterOpen(true)}
          >
            {UI_STRINGS.employees.registerNewEmployee}
          </Button>
        }
      />

      <Divider sx={{ mb: 4 }} />

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={50} />
        </Box>
      ) : employees.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', borderStyle: 'dashed' }}>
          <Typography variant="h6" color="text.secondary">
            לא נמצאו עובדים רשומים בחברה זו
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {employees.map((emp) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={emp.id}>
              <EmployeeCardItem employeePermission={emp} onRoleUpdated={loadEmployees} />
            </Grid>
          ))}
        </Grid>
      )}

      {companyId && (
        <RegisterEmployeeDialog
          open={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          companyId={companyId}
          onSave={loadEmployees}
          currentEmployees={employees}
        />
      )}
    </Container>
  );
};

export default EmployeesPage;
