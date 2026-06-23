import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { getRecipes } from '../../api/recipe';
import { createProductExecution } from '../../api/createProduct';
import BaseDialog from '../../components/BaseDialog/BaseDialog';

interface RecipeOption {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  dateStr: string; // "YYYY-MM-DD"
  subscriptionId?: number;
  onSave: () => void;
}

const fullDateFormatter = new Intl.DateTimeFormat('he-IL', { dateStyle: 'full' });

const CreateProductLogDialog = ({ open, onClose, dateStr, subscriptionId, onSave }: Props) => {
  const [recipes, setRecipes] = useState<RecipeOption[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | ''>('');
  const [time, setTime] = useState('');
  const [multiplier, setMultiplier] = useState<string>('1');
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset states and load recipes when dialog opens
  useEffect(() => {
    if (!open) return;

    // Set default local time
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setTime(formattedTime);
    setSelectedRecipeId('');
    setMultiplier('1');
    setError('');

    if (!subscriptionId) return;

    const fetchRecipes = async () => {
      setLoadingRecipes(true);
      try {
        const data = await getRecipes(subscriptionId);
        // Only show active (non-deleted) recipes
        setRecipes(data.filter((r: any) => !r.is_deleted));
      } catch (err) {
        console.error('Failed to load recipes', err);
        setError('שגיאה בטעינת מתכונים');
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, [open, subscriptionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipeId || !subscriptionId) {
      setError('אנא בחר מתכון');
      return;
    }
    const parsedMultiplier = parseFloat(multiplier);
    if (isNaN(parsedMultiplier) || parsedMultiplier <= 0) {
      setError('כמות ההכפלה חייבת להיות גדולה מ-0');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Combine dateStr (YYYY-MM-DD) and time (HH:mm) into a local date object
      const [hours, minutes] = time.split(':');
      const executionDate = new Date(dateStr);
      executionDate.setHours(parseInt(hours, 10));
      executionDate.setMinutes(parseInt(minutes, 10));
      executionDate.setSeconds(0);
      executionDate.setMilliseconds(0);

      await createProductExecution({
        recipeId: selectedRecipeId,
        batche_count: parsedMultiplier,
        created_time: executionDate.toISOString(),
      });

      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to log recipe execution', err);
      setError('שגיאה ברישום הכנת המתכון');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for title display in Hebrew
  const getFormattedDateHebrew = () => {
    try {
      const date = new Date(dateStr);
      return fullDateFormatter.format(date);
    } catch {
      return dateStr;
    }
  };

  const actions = (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button onClick={onClose} disabled={submitting} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
        ביטול
      </Button>
      <Button
        type="submit"
        disabled={submitting || loadingRecipes || !selectedRecipeId}
        variant="contained"
        color="primary"
        sx={{
          borderRadius: 2,
          px: 3,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4338ca 0%, #2e2685 100%)',
          }
        }}
      >
        {submitting ? <CircularProgress size={24} color="inherit" /> : 'הכן מתכון'}
      </Button>
    </Box>
  );

  return (
    <form onSubmit={handleSubmit}>
      <BaseDialog
        open={open}
        onClose={onClose}
        title="הכנת מתכון חדש"
        subtitle={getFormattedDateHebrew()}
        actions={actions}
        maxWidth="xs"
      >
        <Box display="flex" flexDirection="column" gap={2.5}>
          {error && (
            <Typography color="error" variant="body2" sx={{ textAlign: 'center', fontWeight: 600 }}>
              {error}
            </Typography>
          )}

          <FormControl fullWidth disabled={loadingRecipes || submitting} error={!selectedRecipeId && !!error}>
            <InputLabel id="recipe-select-label">בחר מתכון</InputLabel>
            <Select
              labelId="recipe-select-label"
              value={selectedRecipeId}
              label="בחר מתכון"
              onChange={(e) => setSelectedRecipeId(Number(e.target.value))}
            >
              {loadingRecipes ? (
                <MenuItem disabled value="">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} />
                    טוען מתכונים...
                  </Box>
                </MenuItem>
              ) : recipes.length === 0 ? (
                <MenuItem disabled value="">
                  לא נמצאו מתכונים
                </MenuItem>
              ) : (
                recipes.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                  </MenuItem>
                ))
              )}
            </Select>
            <FormHelperText>בחר את המתכון שברצונך להכין בתאריך זה</FormHelperText>
          </FormControl>

          <TextField
            label="שעת הכנה"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={submitting}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="כמות להכפלה"
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            disabled={submitting}
            fullWidth
            inputProps={{ min: 0.01, step: 'any' }}
            helperText="פי כמה להכפיל את חומרי הגלם במתכון (לדוגמה: 0.5)"
          />
        </Box>
      </BaseDialog>
    </form>
  );
};

export default CreateProductLogDialog;
