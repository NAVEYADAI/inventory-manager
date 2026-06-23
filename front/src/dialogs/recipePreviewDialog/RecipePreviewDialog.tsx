import { Button, Box, Typography, Stack } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { UOM_hebrew_names } from '../../enums';
import { type RecipeDto } from '../../api/recipe';
import BaseDialog from '../../components/BaseDialog/BaseDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  recipe: RecipeDto | null;
  onExecute: (recipe: RecipeDto) => void;
}

const RecipePreviewDialog = ({ open, onClose, recipe, onExecute }: Props) => {
  if (!recipe) return null;

  const actions = (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button
        onClick={() => onExecute(recipe)}
        variant="contained"
        color="success"
        sx={{
          borderRadius: 2,
          px: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          }
        }}
      >
        הכן מתכון
      </Button>
      <Button
        onClick={onClose}
        variant="outlined"
        color="inherit"
        sx={{
          borderRadius: 2,
          px: 4,
          fontWeight: 700,
        }}
      >
        סגור
      </Button>
    </Box>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={recipe.name}
      subtitle={`מזהה מתכון: #${recipe.id}`}
      icon={<MenuBookIcon color="primary" sx={{ fontSize: 32 }} />}
      actions={actions}
      maxWidth="sm"
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }} color="text.primary">
        רשימת רכיבים וכמויות
      </Typography>

      <Box
        sx={{
          maxHeight: '350px',
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
            recipe.recipe_product.map((item) => (
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
                <Typography variant="body1" color="primary.main" fontWeight={700}>
                  {item.volume} {UOM_hebrew_names[item.uom] || item.uom}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              אין רכיבים במתכון זה.
            </Typography>
          )}
        </Stack>
      </Box>
    </BaseDialog>
  );
};

export default RecipePreviewDialog;
