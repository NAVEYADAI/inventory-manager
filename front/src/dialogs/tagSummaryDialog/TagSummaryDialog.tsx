import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Divider,
  Button,
  Grid,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { getTagSummary, type TagSummaryDto } from '../../api/tag';
import BaseDialog from '../../components/BaseDialog/BaseDialog';
import { UOM, UOM_hebrew_names } from '../../enums';

interface Props {
  open: boolean;
  onClose: () => void;
  tagId: number | null;
  onEditClick?: () => void; // Optional callback to switch to editing
}

const dateFormatter = new Intl.DateTimeFormat('he-IL', {
  dateStyle: 'medium',
});

const TagSummaryDialog = ({ open, onClose, tagId, onEditClick }: Props) => {
  const [summary, setSummary] = useState<TagSummaryDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !tagId) return;

    const fetchSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTagSummary(tagId);
        setSummary(data);
      } catch (err) {
        console.error('Failed to load tag summary', err);
        setError('שגיאה בטעינת סיכום תקופת הייצור');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [open, tagId]);

  const getHebrewDateRange = () => {
    if (!summary?.tag) return '';
    try {
      const start = new Date(summary.tag.startDate);
      const end = new Date(summary.tag.endDate);
      return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
    } catch {
      return '';
    }
  };

  const actions = (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button
        onClick={onEditClick}
        variant="outlined"
        color="primary"
        disabled={loading}
        sx={{ borderRadius: 2 }}
      >
        ערוך הגדרות תג
      </Button>
      <Button
        onClick={onClose}
        variant="contained"
        color="inherit"
        sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
      >
        סגור
      </Button>
    </Box>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={summary?.tag.name || 'פרטי תקופת ייצור (תג)'}
      subtitle={getHebrewDateRange() || 'חישוב כמויות מרוכז לפי טווח תאריכים'}
      icon={<AnalyticsIcon color="primary" sx={{ fontSize: 32 }} />}
      actions={actions}
      maxWidth="md"
    >
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="body1" sx={{ textAlign: 'center', py: 4, fontWeight: 600 }}>
          {error}
        </Typography>
      ) : summary ? (
        <Box display="flex" flexDirection="column" gap={4.5}>
          {summary.tag.description && (
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, borderLeft: '4px solid #1976d2' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {summary.tag.description}
              </Typography>
            </Box>
          )}

          <Grid container spacing={4}>
            {/* Recipes Executed Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <MenuBookIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                  מתכונים שהוכנו בתקופה זו ({summary.recipes.length})
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '3px' },
                }}
              >
                <Stack spacing={1.5}>
                  {summary.recipes.length > 0 ? (
                    summary.recipes.map((item) => (
                      <Box
                        key={item.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderRadius: 2.5,
                          bgcolor: 'action.hover',
                          border: '1px solid #f1f5f9',
                        }}
                      >
                        <Typography variant="body2" fontWeight={700} color="text.primary">
                          {item.name}
                        </Typography>
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="body2" color="primary.main" fontWeight={800}>
                            כפול {item.totalBatches}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            סה"כ {item.executionCount} פעמים
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      לא נמצאו הכנות מתכונים מתועדות בטווח זה.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Grid>

            {/* Ingredients Quantity Summary Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <ShoppingBagIcon color="success" />
                <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                  חומרי גלם וכמויות שהוכנו בפועל ({summary.rawMaterials.length})
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '3px' },
                }}
              >
                <Stack spacing={1.5}>
                  {summary.rawMaterials.length > 0 ? (
                    summary.rawMaterials.map((item) => {
                      const uomHebrew = UOM_hebrew_names[item.uom as UOM] || item.uom;
                      return (
                        <Box
                          key={item.id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 2.5,
                            bgcolor: 'action.hover',
                            border: '1px solid #f1f5f9',
                          }}
                        >
                          <Typography variant="body2" fontWeight={700} color="text.primary">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="success.main" fontWeight={800}>
                            {item.volume} {uomHebrew}
                          </Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      לא חושבו דרישות לחומרי גלם בתקופה זו.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </BaseDialog>
  );
};

export default TagSummaryDialog;
