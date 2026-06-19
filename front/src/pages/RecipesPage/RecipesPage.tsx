import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Grid, Typography,
  IconButton, Divider, CircularProgress, Paper, Stack, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import { UOM_hebrew_names } from '../../enums';
import { getRecipes, deleteRecipe, type RecipeDto } from '../../api/recipe';
import CreateRecipeDialog from '../../dialogs/createRecipeDialog/CreateRecipeDialog';
import RecipePreviewDialog from '../../dialogs/recipePreviewDialog/RecipePreviewDialog';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ExecuteRecipeDialog from '../../dialogs/executeRecipeDialog/ExecuteRecipeDialog';

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

  const handleDelete = async (id: number) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) return;
    try {
      await deleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error('Failed to delete recipe', e);
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={4} dir="rtl" sx={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #673ab7 100%)',
          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <MenuBookIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>ספר המתכונים</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              נהל את כל המתכונים והרכיבים של העסק שלך במקום אחד
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingRecipe(null);
            setIsCreateOpen(true);
          }}
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(156, 39, 176, 0.4)'
            }
          }}
        >
          מתכון חדש
        </Button>
      </Paper>

      {/* Search Bar */}
      {recipes.length > 0 && (
        <Box mb={4}>
          <TextField
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
        </Box>
      )}

      {/* Main Content List */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : recipes.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
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
        </Paper>
      ) : filteredRecipes.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            לא נמצאו מתכונים המתאימים לחיפוש "{searchQuery}"
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredRecipes.map((recipe) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recipe.id}>
              <Card
                variant="outlined"
                sx={{
                  height: '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
                  }
                }}
                onClick={() => handleOpenPreview(recipe)}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography variant="h6" fontWeight={700} color="text.primary" noWrap sx={{ maxWidth: '70%' }}>
                      {recipe.name}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenExecute(recipe);
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
                          setEditingRecipe(recipe);
                          setIsCreateOpen(true);
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
                          handleDelete(recipe.id);
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
                  <Box
                    sx={{
                      flexGrow: 1,
                      overflowY: 'auto',
                      maxHeight: '190px',
                      pr: 0.5,
                      '&::-webkit-scrollbar': {
                        width: '4px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#cbd5e1',
                        borderRadius: '2px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#94a3b8',
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      {recipe.recipe_product && recipe.recipe_product.length > 0 ? (
                        recipe.recipe_product.map((item) => (
                          <Box
                            key={item.id}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              px: 1.5,
                              py: 0.75,
                              borderRadius: 1.5,
                              bgcolor: 'action.hover'
                            }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {item.raw_material?.name || 'חומר גלם לא ידוע'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                              {item.volume} {UOM_hebrew_names[item.uom] || item.uom}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          אין רכיבים במתכון זה.
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
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
    </Box>
  );
};

export default RecipesPage;
