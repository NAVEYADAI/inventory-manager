import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import TextInput from '../../components/Inputs/TextInput';
import { getActivityLogs, type ActivityLogDto } from '../../api/activityLog';
import { AccessDeniedWrapper } from './ActivityLogPage.style';
import ThemedPageHeader from '../../components/PageHeader/PageHeader';

const actionLabels: Record<string, { label: string; color: string }> = {
  CREATE_RECIPE: { label: 'יצירת מתכון', color: '#10b981' },
  UPDATE_RECIPE: { label: 'עדכון מתכון', color: '#3b82f6' },
  DELETE_RECIPE: { label: 'מחיקת מתכון', color: '#ef4444' },
  CREATE_RAW_MATERIAL_BULK: { label: 'הוספת חומרי גלם', color: '#059669' },
  UPDATE_RAW_MATERIAL: { label: 'עדכון חומר גלם', color: '#2563eb' },
  DELETE_RAW_MATERIAL: { label: 'מחיקת חומר גלם', color: '#dc2626' },
  ADD_RAW_MATERIAL_CONVERSION: { label: 'הוספת המרה', color: '#8b5cf6' },
  EXECUTE_RECIPE: { label: 'ביצוע הכנה', color: '#10b981' },
  UPDATE_EXECUTION_YIELD: { label: 'השלמת כמות', color: '#3b82f6' },
  DELETE_EXECUTION: { label: 'מחיקת הכנה', color: '#f59e0b' },
  REGISTER_EMPLOYEE: { label: 'רישום עובד', color: '#7c3aed' },
  UPDATE_EMPLOYEE_ROLE: { label: 'עדכון תפקיד', color: '#ea580c' },
  REMOVE_EMPLOYEE: { label: 'הסרת עובד', color: '#b91c1c' },
};

const ActivityLogPage = () => {
  const [logs, setLogs] = useState<ActivityLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'work_management' | 'employee_management'>('all');

  // Load active company and user roles from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const selectedCompany = user?.selectedCompany;
  const subscriptionId = selectedCompany?.subscriptionId;
  const userRole = selectedCompany?.role;

  const isOwner = userRole === 'owner';
  const isAdmin = userRole === 'admin';
  const hasAccess = isOwner || isAdmin;

  useEffect(() => {
    const loadLogs = async () => {
      if (!subscriptionId || !hasAccess) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getActivityLogs(subscriptionId);
        setLogs(data);
      } catch (err) {
        console.error('Failed to load activity logs', err);
        setError('שגיאה בטעינת יומן הפעולות. אנא נסה שוב מאוחר יותר.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [subscriptionId, hasAccess]);

  const handleCategoryChange = (
    _event: React.MouseEvent<HTMLElement>,
    newCategory: 'all' | 'work_management' | 'employee_management' | null,
  ) => {
    if (newCategory !== null) {
      setCategoryFilter(newCategory);
    }
  };

  // Filter logs based on search and category tab selection
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter (Admins can only see work_management anyway, backend handles safety)
      if (categoryFilter !== 'all' && log.category !== categoryFilter) {
        return false;
      }

      // Search query filter (search by user name or action details)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const userNameMatch = log.userName?.toLowerCase().includes(query) || false;
        const detailsMatch = log.details?.toLowerCase().includes(query) || false;
        const actionMatch = actionLabels[log.action]?.label.toLowerCase().includes(query) || false;
        return userNameMatch || detailsMatch || actionMatch;
      }

      return true;
    });
  }, [logs, categoryFilter, searchQuery]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('he-IL', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

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
            דף זה זמין לבעלי העסק ולמנהלים בלבד. אם הינך מנהל החברה, אנא ודא שהתפקיד שלך מוגדר כראוי במערכת.
          </Typography>
        </AccessDeniedWrapper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" dir="rtl" sx={{ py: 4 }}>
      <ThemedPageHeader
        title="יומן פעולות מערכת"
        subtitle="מעקב אחר השינויים והפעולות שבוצעו במערכת המלאי והעובדים."
        colorTheme="activity"
        icon={<HistoryIcon />}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* Toolbar - Search & Category Filter */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          border: '1px solid #e2e8f0',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
        >
          {/* Search bar */}
          <Box sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}>
            <TextInput
              placeholder="חפש לפי שם עובד או פעולה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  style: { borderRadius: 12, backgroundColor: '#f8fafc' },
                },
              }}
            />
          </Box>

          {/* Category filter tabs (Only visible/available if Owner has access to both) */}
          {isOwner && (
            <ToggleButtonGroup
              value={categoryFilter}
              exclusive
              onChange={handleCategoryChange}
              aria-label="log category filter"
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: '10px',
                  mx: 0.5,
                  border: '1px solid #e2e8f0',
                  px: 2,
                  py: 1,
                  fontWeight: 700,
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="all">כל הלוגים</ToggleButton>
              <ToggleButton value="work_management">ניהול עבודה</ToggleButton>
              <ToggleButton value="employee_management">ניהול עובדים</ToggleButton>
            </ToggleButtonGroup>
          )}

          {isAdmin && (
            <Alert severity="info" icon={false} sx={{ py: 0, px: 2, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={700}>
                גישה: ניהול עבודה בלבד
              </Typography>
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* Logs Table */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 12 }}>
          <CircularProgress size={50} sx={{ color: '#1e3c72' }} />
        </Box>
      ) : filteredLogs.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
          }}
        >
          <HistoryIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" fontWeight={700} color="text.secondary">
            לא נמצאו פעולות מתועדות
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            אין רשומות התואמות לפילטרים שנבחרו או שטרם בוצעו פעולות במערכת.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="activity logs table">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>מועד</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>עובד מבצע</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>קטגוריה</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>סוג פעולה</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>פירוט השינוי</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => {
                const actionInfo = actionLabels[log.action] || { label: log.action, color: '#64748b' };
                const isEmployeeCat = log.category === 'employee_management';

                return (
                  <TableRow
                    key={log.id}
                    sx={{
                      '&:hover': { bgcolor: '#f8fafc' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', color: '#475569' }}>
                      {formatDate(log.createdTime)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {log.userName || 'מערכת'}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={isEmployeeCat ? 'ניהול עובדים' : 'ניהול עבודה'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          borderRadius: '8px',
                          color: isEmployeeCat ? '#7c3aed' : '#2563eb',
                          bgcolor: isEmployeeCat ? '#f5f3ff' : '#eff6ff',
                          border: `1px solid ${isEmployeeCat ? '#ddd6fe' : '#bfdbfe'}`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={actionInfo.label}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          borderRadius: '8px',
                          color: '#ffffff',
                          bgcolor: actionInfo.color,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#334155', fontWeight: 500 }}>
                      {log.details}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ActivityLogPage;
