import React from 'react';
import { Box, IconButton, Divider, Typography, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { UOM, UOM_hebrew_names } from '../../../enums';
import type { RecipeDto } from '../../../api/recipe';
import {
  RecipeCard,
  RecipeCardContent,
  RecipeCardTitle,
  IngredientList,
  IngredientItem,
} from '../RecipesPage.style';

interface RecipeCardItemProps {
  recipe: RecipeDto;
  onPreview: (recipe: RecipeDto) => void;
  onExecute: (recipe: RecipeDto) => void;
  onEdit: (recipe: RecipeDto) => void;
  onDelete: (id: number) => void;
}

const RecipeCardItem: React.FC<RecipeCardItemProps> = ({
  recipe,
  onPreview,
  onExecute,
  onEdit,
  onDelete,
}) => {
  return (
    <RecipeCard
      variant="outlined"
      onClick={() => onPreview(recipe)}
    >
      <RecipeCardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <RecipeCardTitle variant="h6" color="text.primary">
            {recipe.name}
          </RecipeCardTitle>
          <Box display="flex" gap={0.5}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onExecute(recipe);
              }}
              color="success"
              size="small"
              title="רשום הכנת מתכון"
            >
              <RestaurantIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(recipe);
              }}
              color="primary"
              size="small"
              title="ערוך מתכון"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipe.id);
              }}
              color="error"
              size="small"
              title="מחק מתכון"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">
          רכיבים:
        </Typography>

        {/* Scrollable list of ingredients */}
        <IngredientList>
          <Stack spacing={1}>
            {recipe.recipe_product && recipe.recipe_product.length > 0 ? (
              recipe.recipe_product.map((item) => (
                <IngredientItem key={item.id}>
                  <Typography variant="body2" fontWeight={500}>
                    {item.raw_material?.name || 'חומר גלם לא ידוע'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {item.volume} {item.uom === UOM.CUSTOM ? (item.customUom || 'יחידה מותאמת') : (UOM_hebrew_names[item.uom as UOM] || item.uom)}
                  </Typography>
                </IngredientItem>
              ))
            ) : (
              <Typography variant="caption" color="text.secondary">
                אין רכיבים במתכון זה.
              </Typography>
            )}
          </Stack>
        </IngredientList>
      </RecipeCardContent>
    </RecipeCard>
  );
};

export default RecipeCardItem;
