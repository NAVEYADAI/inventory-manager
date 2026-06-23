import {
  Button,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DeleteIcon from '@mui/icons-material/Delete';
import { UOM, UOM_hebrew_names } from '../../enums';
import { deleteProductExecution } from '../../api/createProduct';
import BaseDialog from '../../components/BaseDialog/BaseDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  execution: any | null;
  onDelete: () => void;
}

const fullDateFormatter = new Intl.DateTimeFormat('he-IL', {
  dateStyle: 'full',
  timeStyle: 'short',
});

const RecipeExecutionDetailDialog = ({ open, onClose, execution, onDelete }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!execution) return null;

  const handleCreateProductDelete = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק רישום הכנה זה מהלוח?')) return;

    setDeleting(true);
    setError('');
    try {
      await deleteProductExecution(execution.id);
      onDelete();
      onClose();
    } catch (err) {
      console.error('Failed to delete execution', err);
      setError('שגיאה במחיקת רישום ההכנה');
    } finally {
      setDeleting(false);
    }
  };

  const getFormattedDateTime = () => {
    try {
      const date = new Date(execution.created_time);
      return fullDateFormatter.format(date);
    } catch {
      return execution.created_time;
    }
  };

  const recipe = execution.recipe || {};
  const multiplier = execution.batche_count || 1;

  const actions = (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button
        onClick={handleCreateProductDelete}
        variant="outlined"
        color="error"
        disabled={deleting}
        startIcon={<DeleteIcon />}
        sx={{ borderRadius: 2, fontWeight: 700 }}
      >
        {deleting ? 'מוחק...' : 'מחק הכנה'}
      </Button>
      <Button
        onClick={onClose}
        variant="contained"
        color="inherit"
        disabled={deleting}
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
      title={`הכנת מתכון: ${recipe.name || 'מתכון לא ידוע'}`}
      subtitle={`מועד ביצוע: ${getFormattedDateTime()}`}
      icon={<MenuBookIcon color="primary" sx={{ fontSize: 32 }} />}
      actions={actions}
      maxWidth="sm"
    >
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mb: 3, p: 2, borderRadius: 2, color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
        <Typography variant="body1" fontWeight={700}>
          מקדם הכפלה (כמות מנות):
        </Typography>
        <Typography variant="h5" fontWeight={800}>
          כפול {parseFloat(Number(multiplier).toFixed(3))}
        </Typography>
      </Box>

      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }} color="text.primary">
        חישוב כמויות רכיבים בפועל:
      </Typography>

      <Box
        sx={{
          maxHeight: '300px',
          overflowY: 'auto',
          pr: 1,
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
            recipe.recipe_product.map((item: any) => {
              const uomHebrew = UOM_hebrew_names[item.uom as UOM] || item.uom;
              const baseVolume = item.volume;
              const actualVolume = parseFloat((baseVolume * multiplier).toFixed(3));

              return (
                <Box
                  key={item.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    {item.raw_material?.name || 'חומר גלם לא ידוע'}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="text.secondary">
                      ({baseVolume} {uomHebrew})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      ⬅️ &nbsp;
                      <Typography component="span" variant="body1" color="success.main" fontWeight={700}>
                        {actualVolume} {uomHebrew}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              אין רכיבים מתועדים במתכון זה.
            </Typography>
          )}
        </Stack>
      </Box>
    </BaseDialog>
  );
};

export default RecipeExecutionDetailDialog;
