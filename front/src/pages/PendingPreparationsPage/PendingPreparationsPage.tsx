import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  InputAdornment,
  Fade,
  Stack
} from '@mui/material';
import TextInput from '../../components/Inputs/TextInput';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PageHeader from '../../components/PageHeader/PageHeader';
import { getProductExecutions, updateProductExecution, type CreateProductDto } from '../../api/createProduct';

const PendingPreparationsPage = () => {
  const [executions, setExecutions] = useState<CreateProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingIds, setUpdatingIds] = useState<Record<number, boolean>>({});
  const [successIds, setSuccessIds] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [yieldValues, setYieldValues] = useState<Record<number, string>>({});

  // Fetch subscriptionId from localStorage
  const userStr = localStorage.getItem('user');
  let subscriptionId: number | undefined = undefined;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      subscriptionId = user.selectedCompany?.subscriptionId;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
  }

  const loadData = useCallback(async () => {
    if (!subscriptionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductExecutions(subscriptionId);
      // Filter out executions that already have actualYield
      const pending = data.filter((item) => item.actualYield === null || item.actualYield === undefined);
      setExecutions(pending);
    } catch (err) {
      console.error('Failed to load pending preparations', err);
      setError('שגיאה בטעינת ההכנות הממתינות. נא לנסות שנית.');
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleYieldChange = (id: number, val: string) => {
    // Sanitize decimal input (support comma replacement and digits/dots only)
    const sanitized = val.replace('ץ', '.').replace(/[^0-9.,]/g, '');
    setYieldValues((prev) => ({ ...prev, [id]: sanitized }));
  };

  const handleSave = async (id: number) => {
    const rawVal = yieldValues[id] || '';
    const parsedYield = parseFloat(rawVal.replace(',', '.'));

    if (isNaN(parsedYield) || parsedYield <= 0) {
      alert('נא להזין כמות תקינה הגדולה מ-0');
      return;
    }

    setUpdatingIds((prev) => ({ ...prev, [id]: true }));
    try {
      await updateProductExecution(id, { actualYield: parsedYield });
      setSuccessIds((prev) => ({ ...prev, [id]: true }));

      // Fade out and remove the item after successful animation
      setTimeout(() => {
        setExecutions((prev) => prev.filter((item) => item.id !== id));
        setYieldValues((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to save actual yield', err);
      alert('שגיאה בשמירת הכמות. נא לנסות שנית.');
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Filter pending items by search query
  const filteredExecutions = useMemo(() => {
    return executions.filter((item) => {
      const recipeName = item.recipe?.name || '';
      return recipeName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [executions, searchQuery]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dateFormatted = new Intl.DateTimeFormat('he-IL', { dateStyle: 'medium' }).format(d);
    const timeFormatted = new Intl.DateTimeFormat('he-IL', { timeStyle: 'short' }).format(d);
    return `${dateFormatted} בשעה ${timeFormatted}`;
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        bgcolor: '#f8fafc',
        py: 4,
        px: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      dir="rtl"
    >
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        {/* Header */}
        <PageHeader
          title="השלמת כמויות הכנה"
          subtitle="הכנות מוצרים שבוצעו ללא הזנת כמות יציאה בפועל. הזן כמויות כדי לעדכן את המלאי בהתאם."
          colorTheme="success"
          icon={<FactCheckIcon />}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search */}
        <Box sx={{ mb: 4, width: '100%', maxWidth: '500px' }}>
          <TextInput
            placeholder="חפש לפי שם מתכון..."
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
                style: { borderRadius: 12, backgroundColor: '#ffffff' },
              },
            }}
          />
        </Box>

        {/* Content Section */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 8 }}>
            <CircularProgress size={50} sx={{ color: '#1e3c72' }} />
          </Box>
        ) : filteredExecutions.length === 0 ? (
          <Fade in={true} timeout={600}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: 10,
                px: 3,
                bgcolor: '#ffffff',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)',
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 45, color: '#22c55e' }} />
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
                אין הכנות להשלמה!
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '400px' }}>
                כל כמויות היציאה של ההכנות שלך מעודכנות במערכת בצורה מלאה. עבודה מצוינת!
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {filteredExecutions.map((item) => {
              const isUpdating = !!updatingIds[item.id];
              const isSuccess = !!successIds[item.id];
              const yieldTypeLabel = item.recipe?.yieldType === 'UNITS' ? 'יחידות' : 'משקל (ק״ג/גרם)';
              const yieldPlaceholder = item.recipe?.yieldType === 'UNITS' ? 'למשל: 50' : 'למשל: 2.5';
              const inputVal = yieldValues[item.id] || '';

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Fade in={true}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        border: isSuccess ? '2px solid #22c55e' : '1px solid #e2e8f0',
                        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06)',
                        },
                        bgcolor: isSuccess ? '#f0fdf4' : '#ffffff',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2}>
                          {/* Recipe Title & Icon */}
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                              sx={{
                                width: 42,
                                height: 42,
                                borderRadius: '10px',
                                bgcolor: isSuccess ? '#dcfce7' : '#eff6ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <RestaurantMenuIcon sx={{ color: isSuccess ? '#22c55e' : '#2563eb' }} />
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                noWrap
                                sx={{ color: '#1e293b' }}
                              >
                                {item.recipe?.name || 'מתכון ללא שם'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                סוג תוצר: {yieldTypeLabel}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Details List */}
                          <Stack spacing={1} sx={{ bgcolor: isSuccess ? '#f8fafc' : '#f8fafc', p: 2, borderRadius: 3 }}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                תאריך ושעה:
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ color: '#334155' }}>
                                {formatDate(item.created_time)}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                כמות הכפלה (Batches):
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ color: '#334155' }}>
                                x{item.batche_count}
                              </Typography>
                            </Stack>
                          </Stack>

                          {/* Save & Input Section */}
                          {isSuccess ? (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              gap={1}
                              sx={{ py: 1.5, color: '#22c55e' }}
                            >
                              <CheckCircleOutlineIcon />
                              <Typography fontWeight={700}>הכמות נשמרה בהצלחה!</Typography>
                            </Box>
                          ) : (
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <TextInput
                                placeholder={yieldPlaceholder}
                                value={inputVal}
                                onChange={(e) => handleYieldChange(item.id, e.target.value)}
                                disabled={isUpdating}
                                fullWidth
                                slotProps={{
                                  input: {
                                    style: { borderRadius: 10 },
                                  },
                                }}
                                sx={{ mb: 0 }}
                              />
                              <Button
                                variant="contained"
                                onClick={() => handleSave(item.id)}
                                disabled={isUpdating || !inputVal.trim()}
                                sx={{
                                  height: '42px',
                                  borderRadius: '10px',
                                  px: 3,
                                  fontWeight: 700,
                                  color: '#ffffff',
                                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                  boxShadow: '0 4px 10px rgba(30, 60, 114, 0.25)',
                                  textTransform: 'none',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
                                  },
                                }}
                              >
                                {isUpdating ? <CircularProgress size={20} color="inherit" /> : 'שמור'}
                              </Button>
                            </Stack>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default PendingPreparationsPage;
