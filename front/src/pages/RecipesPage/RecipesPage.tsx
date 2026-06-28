import { useEffect, useState } from 'react';
import {
  Box, Button, Grid, Typography,
  CircularProgress, Stack
} from '@mui/material';
import TextInput from '../../components/Inputs/TextInput';
import {
  RecipesContainer,
  RecipesHeader,
  AddRecipeButton,
  SearchWrapper,
  EmptyStateWrapper,
} from './RecipesPage.style';
import SearchIcon from '@mui/icons-material/Search';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import { getRecipes, deleteRecipe, type RecipeDto } from '../../api/recipe';
import CreateRecipeDialog from '../../dialogs/createRecipeDialog/CreateRecipeDialog';
import RecipePreviewDialog from '../../dialogs/recipePreviewDialog/RecipePreviewDialog';
import ExecuteRecipeDialog from '../../dialogs/executeRecipeDialog/ExecuteRecipeDialog';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import RecipeCardItem from './components/RecipeCardItem';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<RecipeDto | null>(null);
  const [previewRecipe, setPreviewRecipe] = useState<RecipeDto | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [executeRecipe, setExecuteRecipe] = useState<RecipeDto | null>(null);
  const [isExecuteOpen, setIsExecuteOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenExecute = (recipe: RecipeDto) => {
    setExecuteRecipe(recipe);
    setIsExecuteOpen(true);
  };

  const handleOpenPreview = (recipe: RecipeDto) => {
    setPreviewRecipe(recipe);
    setIsPreviewOpen(true);
  };

  // Retrieve current subscriptionId
  const userStr = localStorage.getItem("user");
  let subscriptionId: number | undefined = undefined;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      subscriptionId = user.selectedCompany?.subscriptionId;
    } catch { }
  }

  const loadRecipes = async () => {
    if (!subscriptionId) return;
    setIsLoading(true);
    try {
      const data = await getRecipes(subscriptionId);
      setRecipes(data);
    } catch (e) {
      console.error('Failed to load recipes', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [subscriptionId]);

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setIsDeleting(true);
    try {
      await deleteRecipe(deleteConfirmId);
      setRecipes(prev => prev.filter(r => r.id !== deleteConfirmId));
    } catch (e) {
      console.error('Failed to delete recipe', e);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <RecipesContainer dir="rtl">
      {/* Header section */}
      <RecipesHeader elevation={0}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ width: "100%", justifyContent: { xs: "center", sm: "flex-start" } }}>
          <MenuBookIcon sx={{ fontSize: 40 }} />
          <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
            <Typography variant="h4" fontWeight={700}>ספר המתכונים</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              נהל את כל המתכונים והרכיבים של העסק שלך במקום אחד
            </Typography>
          </Box>
        </Stack>
        <AddRecipeButton
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingRecipe(null);
            setIsCreateOpen(true);
          }}
        >
          מתכון חדש
        </AddRecipeButton>
      </RecipesHeader>

      {/* Search Bar */}
      {recipes.length > 0 && (
        <SearchWrapper>
          <TextInput
            fullWidth
            variant="outlined"
            placeholder="חפש מתכון לפי שם..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <SearchIcon color="action" sx={{ ml: 1, mr: 0.5 }} />
                ),
                style: { borderRadius: 12 }
              }
            }}
          />
        </SearchWrapper>
      )}

      {/* Main Content List */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : recipes.length === 0 ? (
        <EmptyStateWrapper variant="outlined">
          <LocalFloristIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            אין עדיין מתכונים רשומים במערכת
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            לחץ על כפתור "מתכון חדש" כדי להתחיל ליצור את המתכון הראשון שלך!
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setEditingRecipe(null);
              setIsCreateOpen(true);
            }}
            sx={{ borderRadius: 2 }}
          >
            צור מתכון ראשון
          </Button>
        </EmptyStateWrapper>
      ) : filteredRecipes.length === 0 ? (
        <EmptyStateWrapper variant="outlined">
          <Typography variant="h6" color="text.secondary">
            לא נמצאו מתכונים המתאימים לחיפוש "{searchQuery}"
          </Typography>
        </EmptyStateWrapper>
      ) : (
        <Grid container spacing={3}>
          {filteredRecipes.map((recipe) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recipe.id}>
              <RecipeCardItem
                recipe={recipe}
                onPreview={handleOpenPreview}
                onExecute={handleOpenExecute}
                onEdit={(rec) => {
                  setEditingRecipe(rec);
                  setIsCreateOpen(true);
                }}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <CreateRecipeDialog
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingRecipe(null);
        }}
        onSave={loadRecipes}
        subscriptionId={subscriptionId}
        recipeToEdit={editingRecipe}
      />

      {/* Recipe Preview Dialog */}
      <RecipePreviewDialog
        open={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewRecipe(null);
        }}
        recipe={previewRecipe}
        onExecute={(recipe) => {
          setIsPreviewOpen(false);
          setPreviewRecipe(null);
          handleOpenExecute(recipe);
        }}
      />

      {/* Execute Recipe Dialog */}
      <ExecuteRecipeDialog
        open={isExecuteOpen}
        onClose={() => {
          setIsExecuteOpen(false);
          setExecuteRecipe(null);
        }}
        recipe={executeRecipe}
        onSave={() => {
          // Reload recipes list if needed, or simply let the event log run
          loadRecipes();
        }}
      />

      {/* Reusable Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="מחיקת מתכון"
        message="האם אתה בטוח שברצונך למחוק מתכון זה? פעולה זו תסיר את המתכון מספר המתכונים באופן קבוע."
        confirmText="מחק"
        cancelText="ביטול"
        severity="error"
      />
    </RecipesContainer>
  );
};

export default RecipesPage;
