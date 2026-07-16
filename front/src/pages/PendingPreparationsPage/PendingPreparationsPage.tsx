import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Typography,
  Grid,
  CardContent,
  CircularProgress,
  Alert,
  InputAdornment,
  Fade,
  Stack,
} from '@mui/material';
import TextInput from '../../components/Inputs/TextInput';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PageHeader from '../../components/PageHeader/PageHeader';
import { getProductExecutions, updateProductExecution, type CreateProductDto } from '../../api/createProduct';
import { UI_STRINGS } from '../../constants/uiStrings';
import {
  PageContainer,
  ContentWrapper,
  SearchContainer,
  LoadingContainer,
  EmptyStateContainer,
  EmptyStateIconWrapper,
  PreparationCard,
  RecipeIconWrapper,
  InfoContainer,
  SuccessIndicator,
  SaveButton,
  TitleTextWrapper,
} from './PendingPreparationsPage.style';

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
      setError(UI_STRINGS.preparations.loadError);
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
      alert(UI_STRINGS.preparations.invalidVolumeError);
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
      alert(UI_STRINGS.preparations.saveError);
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
    <PageContainer dir="rtl">
      <ContentWrapper>
        {/* Header */}
        <PageHeader
          title={UI_STRINGS.preparations.pageTitle}
          subtitle={UI_STRINGS.preparations.pageSubtitle}
          colorTheme="success"
          icon={<FactCheckIcon />}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search */}
        <SearchContainer>
          <TextInput
            placeholder={UI_STRINGS.preparations.searchPlaceholder}
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
        </SearchContainer>

        {/* Content Section */}
        {isLoading ? (
          <LoadingContainer>
            <CircularProgress size={50} sx={{ color: '#1e3c72' }} />
          </LoadingContainer>
        ) : filteredExecutions.length === 0 ? (
          <Fade in={true} timeout={600}>
            <EmptyStateContainer>
              <EmptyStateIconWrapper>
                <CheckCircleOutlineIcon sx={{ fontSize: 45, color: '#22c55e' }} />
              </EmptyStateIconWrapper>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
                {UI_STRINGS.preparations.emptyStateTitle}
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '400px' }}>
                {UI_STRINGS.preparations.emptyStateSubtitle}
              </Typography>
            </EmptyStateContainer>
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
                    <PreparationCard isSuccess={isSuccess}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2}>
                          {/* Recipe Title & Icon */}
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <RecipeIconWrapper isSuccess={isSuccess}>
                              <RestaurantMenuIcon sx={{ color: isSuccess ? '#22c55e' : '#2563eb' }} />
                            </RecipeIconWrapper>
                            <TitleTextWrapper>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                noWrap
                                sx={{ color: '#1e293b' }}
                              >
                                {item.recipe?.name || UI_STRINGS.preparations.untitledRecipe}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                {UI_STRINGS.preparations.yieldTypePrefix}{yieldTypeLabel}
                              </Typography>
                            </TitleTextWrapper>
                          </Stack>

                          {/* Details List */}
                          <InfoContainer spacing={1}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {UI_STRINGS.preparations.dateTimeLabel}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ color: '#334155' }}>
                                {formatDate(item.created_time)}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {UI_STRINGS.preparations.batchesLabel}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ color: '#334155' }}>
                                x{item.batche_count}
                              </Typography>
                            </Stack>
                          </InfoContainer>

                          {/* Save & Input Section */}
                          {isSuccess ? (
                            <SuccessIndicator>
                              <CheckCircleOutlineIcon />
                              <Typography fontWeight={700}>{UI_STRINGS.preparations.saveSuccess}</Typography>
                            </SuccessIndicator>
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
                              <SaveButton
                                variant="contained"
                                onClick={() => handleSave(item.id)}
                                disabled={isUpdating || !inputVal.trim()}
                              >
                                {isUpdating ? <CircularProgress size={20} color="inherit" /> : UI_STRINGS.preparations.saveButton}
                              </SaveButton>
                            </Stack>
                          )}
                        </Stack>
                      </CardContent>
                    </PreparationCard>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default PendingPreparationsPage;
