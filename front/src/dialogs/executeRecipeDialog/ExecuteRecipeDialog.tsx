import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  CircularProgress,
  Typography,
  Stack,
} from '@mui/material';
import TextInput from '../../components/Inputs/TextInput';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { UOM, UOM_hebrew_names } from '../../enums';
import { createProductExecution } from '../../api/createProduct';
import { type RecipeDto } from '../../api/recipe';
import BaseDialog from '../../components/BaseDialog/BaseDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  recipe: RecipeDto | null;
  onSave: () => void;
}

const ExecuteRecipeDialog = ({ open, onClose, recipe, onSave }: Props) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [multiplier, setMultiplier] = useState('1');
  const [actualYield, setActualYield] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset states when dialog opens
  useEffect(() => {
    if (!open || !recipe) return;

    const now = new Date();
    // YYYY-MM-DD local format
    const localDate = now.toLocaleDateString('en-CA');
    // HH:mm local format
    const localTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setDate(localDate);
    setTime(localTime);
    setMultiplier('1');
    setActualYield('');
    setError('');
  }, [open, recipe]);

  if (!recipe) return null;

  const parsedMultiplier = parseFloat(multiplier) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe) return;

    const finalMultiplier = parseFloat(multiplier);
    if (isNaN(finalMultiplier) || finalMultiplier <= 0) {
      setError('כמות ההכפלה חייבת להיות מספר גדול מ-0');
      return;
    }

    if (!date) {
      setError('אנא בחר תאריך');
      return;
    }

    if (!time) {
      setError('אנא בחר שעה');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Combine date (YYYY-MM-DD) and time (HH:mm) into a local Date
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const executionDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

      const payload: any = {
        recipeId: recipe.id,
        batche_count: finalMultiplier,
        created_time: executionDate.toISOString(),
      };

      if (actualYield.trim()) {
        const parsedYield = parseFloat(actualYield.replace(',', '.'));
        if (!isNaN(parsedYield) && parsedYield > 0) {
          payload.actualYield = parsedYield;
        }
      }

      await createProductExecution(payload);

      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to execute recipe', err);
      setError('שגיאה ברישום הכנת המתכון');
    } finally {
      setSubmitting(false);
    }
  };

  const actions = (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button onClick={onClose} disabled={submitting} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
        ביטול
      </Button>
      <Button
        type="submit"
        disabled={submitting || parsedMultiplier <= 0}
        variant="contained"
        color="primary"
        sx={{
          borderRadius: 2,
          px: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          }
        }}
      >
        {submitting ? <CircularProgress size={24} color="inherit" /> : 'רשום הכנה'}
      </Button>
    </Box>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={`רשום הכנת מתכון: ${recipe.name}`}
      subtitle={`מזהה מתכון: #${recipe.id}`}
      icon={<RestaurantIcon color="primary" sx={{ fontSize: 32 }} />}
      actions={actions}
      maxWidth="sm"
      onSubmit={handleSubmit}
    >
        <Box display="flex" flexDirection="column" gap={3}>
          {error && (
            <Typography color="error" variant="body2" sx={{ textAlign: 'center', fontWeight: 600 }}>
              {error}
            </Typography>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextInput
              label="תאריך הכנה"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={submitting}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextInput
              label="שעת הכנה"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={submitting}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <TextInput
            label="כמות להכפלה"
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            disabled={submitting}
            fullWidth
            inputProps={{ min: 0.01, step: 'any' }}
            helperText="פי כמה להכפיל את חומרי הגלם במתכון (לדוגמה: 0.5)"
          />

          <TextInput
            label={recipe.yieldType === 'UNITS' ? "כמות יחידות שיצאו בפועל" : "משקל נטו שהתקבל"}
            type="text"
            inputMode="decimal"
            value={actualYield}
            onChange={(e) => {
              const val = e.target.value.replace("ץ", ".").replace(/[^0-9.,]/g, "");
              setActualYield(val);
            }}
            disabled={submitting}
            fullWidth
            placeholder={recipe.yieldType === 'UNITS' ? "למשל: 50" : "למשל: 2.5 (ק״ג או גרם)"}
            helperText={recipe.yieldType === 'UNITS' ? "הזן את מספר היחידות המדויק שיצא מההכנה" : "הזן את המשקל הנטו המדויק של התוצר לאחר הכנה"}
          />

          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }} color="text.primary">
              חישוב כמויות רכיבים בפועל:
            </Typography>
            <Box
              sx={{
                maxHeight: '220px',
                overflowY: 'auto',
                pr: 1,
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                p: 1.5,
                bgcolor: 'grey.50',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#94a3b8',
                },
              }}
            >
              <Stack spacing={1.5}>
                {recipe.recipe_product && recipe.recipe_product.length > 0 ? (
                  recipe.recipe_product.map((item) => {
                    const uomHebrew = item.uom === UOM.CUSTOM ? (item.customUom || 'יחידה מותאמת') : (UOM_hebrew_names[item.uom as UOM] || item.uom);
                    const baseVolume = item.volume;
                    const actualVolume = parseFloat((baseVolume * parsedMultiplier).toFixed(3));

                    return (
                      <Box
                        key={item.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 1.5,
                          bgcolor: '#ffffff',
                          border: '1px solid #f1f5f9',
                        }}
                      >
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {item.raw_material?.name || 'חומר גלם לא ידוע'}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="caption" color="text.secondary">
                            ({baseVolume} {uomHebrew})
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            ⬅️ &nbsp;
                            <Typography component="span" variant="body2" color="success.main" fontWeight={700}>
                              {actualVolume} {uomHebrew}
                            </Typography>
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    אין רכיבים מתועדים במתכון זה.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      </BaseDialog>
  );
};

export default ExecuteRecipeDialog;
