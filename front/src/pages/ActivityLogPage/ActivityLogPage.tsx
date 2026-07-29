import { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  InputAdornment,
  Stack,
  Alert,
  Button,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import ClearIcon from '@mui/icons-material/Clear';
import Input from '../../components/Inputs/Input';
import { getActivityLogs, type ActivityLogDto } from '../../api/activityLog';
import {
  PageContainer,
  AccessDeniedWrapper,
  LockIconContainer,
  FilterPaper,
  SearchWrapper,
  LoadingContainer,
  EmptyStatePaper,
  LogCard,
  MobileLogStack,
  LogTableContainer,
  CategoryChip,
  ActionChip,
  LogTableRow,
  HeaderCell,
  DateCell,
  UserCell,
  DetailsCell,
} from './ActivityLogPage.style';
import ThemedPageHeader from '../../components/PageHeader/PageHeader';
import { actionLabels, LogCategoryFilter } from './utils';

const ActivityLogPage = () => {
  const [logs, setLogs] = useState<ActivityLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<LogCategoryFilter>(LogCategoryFilter.ALL);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

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


  // Dynamic filter options based on logs
  const uniqueUsers = useMemo(() => {
    const users = new Set<string>();
    logs.forEach((log) => {
      if (log.userName) {
        users.add(log.userName);
      }
    });
    return Array.from(users).sort();
  }, [logs]);

  const uniqueActions = useMemo(() => {
    const actions = new Set<string>();
    logs.forEach((log) => {
      if (log.action) {
        actions.add(log.action);
      }
    });
    return Array.from(actions).sort();
  }, [logs]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter(LogCategoryFilter.ALL);
    setSelectedUser('all');
    setSelectedAction('all');
    setFromDate('');
    setToDate('');
  };

  // Filter logs based on search, category, employee, action type, and date range
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter (Admins can only see work_management anyway, backend handles safety)
      if (categoryFilter !== LogCategoryFilter.ALL && log.category !== categoryFilter) {
        return false;
      }

      // User filter
      if (selectedUser !== 'all' && log.userName !== selectedUser) {
        return false;
      }

      // Action filter
      if (selectedAction !== 'all' && log.action !== selectedAction) {
        return false;
      }

      // Date range filter
      if (fromDate) {
        const logDate = new Date(log.createdTime);
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        if (logDate < start) return false;
      }
      if (toDate) {
        const logDate = new Date(log.createdTime);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        if (logDate > end) return false;
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
  }, [logs, categoryFilter, selectedUser, selectedAction, fromDate, toDate, searchQuery]);

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
      <PageContainer maxWidth="lg" dir="rtl">
        <AccessDeniedWrapper variant="outlined">
          <LockIconContainer>
            <LockIcon sx={{ fontSize: 36 }} />
          </LockIconContainer>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            אין הרשאות גישה
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360 }}>
            דף זה זמין לבעלי העסק ולמנהלים בלבד. אם הינך מנהל החברה, אנא ודא שהתפקיד שלך מוגדר כראוי במערכת.
          </Typography>
        </AccessDeniedWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg" dir="rtl">
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

      {/* Toolbar - Search & Column Filters */}
      <FilterPaper variant="outlined">
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            {/* Search bar */}
            <SearchWrapper>
              <Input
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
            </SearchWrapper>

            {isAdmin && (
              <Alert severity="info" icon={false} sx={{ py: 0, px: 2, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={700}>
                  גישה: ניהול עבודה בלבד
                </Typography>
              </Alert>
            )}
          </Stack>

          {/* New row for advanced filters (Category, User, Action, Date range, Reset) */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ pt: 2, borderTop: '1px solid #f1f5f9' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              flexGrow={1}
              useFlexGap
              flexWrap="wrap"
            >
              {/* Category Filter */}
              {isOwner && (
                <Box sx={{ minWidth: 150, flexGrow: 1 }}>
                  <Input
                    type="select"
                    label="קטגוריה"
                    size="small"
                    state={categoryFilter}
                    setState={(val) => setCategoryFilter(val as LogCategoryFilter)}
                    options={[
                      { label: 'כל הקטגוריות', value: LogCategoryFilter.ALL },
                      { label: 'ניהול עבודה', value: LogCategoryFilter.WORK_MANAGEMENT },
                      { label: 'ניהול עובדים', value: LogCategoryFilter.EMPLOYEE_MANAGEMENT },
                    ]}
                    fullWidth
                  />
                </Box>
              )}

              {/* Employee Filter */}
              <Box sx={{ minWidth: 150, flexGrow: 1 }}>
                <Input
                  type="autocomplete"
                  label="עובד מבצע"
                  size="small"
                  state={selectedUser}
                  setState={setSelectedUser}
                  options={[
                    { label: 'כל העובדים', value: 'all' },
                    ...uniqueUsers.map((user) => ({ label: user, value: user })),
                  ]}
                  fullWidth
                />
              </Box>

              {/* Action Filter */}
              <Box sx={{ minWidth: 180, flexGrow: 1 }}>
                <Input
                  type="autocomplete"
                  label="סוג פעולה"
                  size="small"
                  state={selectedAction}
                  setState={setSelectedAction}
                  options={[
                    { label: 'כל הפעולות', value: 'all' },
                    ...uniqueActions.map((action) => ({
                      label: actionLabels[action]?.label || action,
                      value: action,
                    })),
                  ]}
                  fullWidth
                />
              </Box>

              {/* Date range filters */}
              <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minWidth: 280 }}>
                <Input
                  label="מתאריך"
                  type="date"
                  size="small"
                  state={fromDate}
                  setState={setFromDate}
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      style: { borderRadius: 12, backgroundColor: '#f8fafc' },
                    },
                  }}
                />
                <Input
                  label="עד תאריך"
                  type="date"
                  size="small"
                  state={toDate}
                  setState={setToDate}
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      style: { borderRadius: 12, backgroundColor: '#f8fafc' },
                    },
                  }}
                />
              </Box>
            </Stack>

            {/* Reset Filters button */}
            {(searchQuery || categoryFilter !== LogCategoryFilter.ALL || selectedUser !== 'all' || selectedAction !== 'all' || fromDate || toDate) && (
              <Button
                onClick={handleClearFilters}
                variant="text"
                color="error"
                size="small"
                startIcon={<ClearIcon />}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#fef2f2' }
                }}
              >
                נקה מסננים
              </Button>
            )}
          </Stack>
        </Stack>
      </FilterPaper>

      {/* Logs Table */}
      {isLoading ? (
        <LoadingContainer>
          <CircularProgress size={50} sx={{ color: '#1e3c72' }} />
        </LoadingContainer>
      ) : filteredLogs.length === 0 ? (
        <EmptyStatePaper variant="outlined">
          <HistoryIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" fontWeight={700} color="text.secondary">
            לא נמצאו פעולות מתועדות
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            אין רשומות התואמות לפילטרים שנבחרו או שטרם בוצעו פעולות במערכת.
          </Typography>
        </EmptyStatePaper>
      ) : (
        <>
          {/* Mobile View: Log Cards (hidden on md-up) */}
          <MobileLogStack spacing={2}>
            {filteredLogs.map((log) => {
              const actionInfo = actionLabels[log.action] || { label: log.action, color: '#64748b' };
              const isEmployeeCat = log.category === 'employee_management';

              return (
                <LogCard key={log.id} variant="outlined">
                  <Stack spacing={1.5}>
                    {/* Top Row: User & Date */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b' }}>
                        {log.userName || 'מערכת'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {formatDate(log.createdTime)}
                      </Typography>
                    </Stack>

                    {/* Middle Row: Chips */}
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <CategoryChip
                        label={isEmployeeCat ? 'ניהול עובדים' : 'ניהול עבודה'}
                        size="small"
                        isEmployeeCat={isEmployeeCat}
                      />
                      <ActionChip
                        label={actionInfo.label}
                        size="small"
                        actionColor={actionInfo.color}
                      />
                    </Stack>

                    {/* Bottom Row: Details */}
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                      {log.details}
                    </Typography>
                  </Stack>
                </LogCard>
              );
            })}
          </MobileLogStack>

          {/* Desktop View: Logs Table (hidden on mobile/tablet) */}
          <LogTableContainer variant="outlined">
            <Table sx={{ minWidth: 650 }} aria-label="activity logs table">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <HeaderCell align="right">מועד</HeaderCell>
                  <HeaderCell align="right">עובד מבצע</HeaderCell>
                  <HeaderCell align="right">קטגוריה</HeaderCell>
                  <HeaderCell align="right">סוג פעולה</HeaderCell>
                  <HeaderCell align="right">פירוט השינוי</HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map((log) => {
                  const actionInfo = actionLabels[log.action] || { label: log.action, color: '#64748b' };
                  const isEmployeeCat = log.category === 'employee_management';

                  return (
                    <LogTableRow key={log.id}>
                      <DateCell align="right">
                        {formatDate(log.createdTime)}
                      </DateCell>
                      <UserCell align="right">
                        {log.userName || 'מערכת'}
                      </UserCell>
                      <TableCell align="right">
                        <CategoryChip
                          label={isEmployeeCat ? 'ניהול עובדים' : 'ניהול עבודה'}
                          size="small"
                          isEmployeeCat={isEmployeeCat}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <ActionChip
                          label={actionInfo.label}
                          size="small"
                          actionColor={actionInfo.color}
                        />
                      </TableCell>
                      <DetailsCell align="right">
                        {log.details}
                      </DetailsCell>
                    </LogTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </LogTableContainer>
        </>
      )}
    </PageContainer>
  );
};

export default ActivityLogPage;
