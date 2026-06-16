import { useEffect, useState } from 'react';
import { UOM, UOM_hebrew_names, MeasurementType, MeasurementType_hebrew_names } from '@inventory-manager/shared';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, IconButton, Box,
  MenuItem, Select, FormControl, InputLabel,
  Divider, Typography, Paper, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getRawMaterials, createRawMaterials, type RawMaterialDto } from '../../api/rawMaterial';
import { createRecipe, updateRecipe, type RecipeDto } from '../../api/recipe';

interface IngredientRow {
  rawMaterialId: number | '';
  volume: string;
  uom: UOM;
}

interface QuickAddRow {
  name: string;
  measurementType: MeasurementType;
  category: string;
}

interface QuickAddState {
  rowIndex: number;
  rows: QuickAddRow[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  subscriptionId?: number;
  recipeToEdit?: RecipeDto | null;
}

const emptyRow = (): IngredientRow => ({
  rawMaterialId: '',
  volume: '',
  uom: UOM.GRAM,
});

const CreateRecipeDialog = ({ open, onClose, onSave, subscriptionId, recipeToEdit }: Props) => {
  const [name, setName] = useState('');
  const [rows, setRows] = useState<IngredientRow[]>([emptyRow()]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterialDto[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerms, setSearchTerms] = useState<Record<number, string>>({});
  const [quickAdd, setQuickAdd] = useState<QuickAddState | null>(null);
  const [isSavingQuickAdd, setIsSavingQuickAdd] = useState(false);

  const loadRawMaterials = async () => {
    if (!subscriptionId) return;
    setIsLoadingMaterials(true);
    try {
      const data = await getRawMaterials(subscriptionId);
      setRawMaterials(data);
    } catch (e) {
      console.error('Failed to load raw materials', e);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  useEffect(() => {
    if (open && subscriptionId) {
      loadRawMaterials();
      if (recipeToEdit) {
        setName(recipeToEdit.name);
        setRows(recipeToEdit.recipe_product.map(p => ({
          rawMaterialId: p.raw_material.id,
          volume: String(p.volume),
          uom: p.uom,
        })));
      } else {
        setName('');
        setRows([emptyRow()]);
      }
    }
  }, [open, subscriptionId, recipeToEdit]);

  useEffect(() => {
    if (rows.length === 0) return;
    const lastRow = rows[rows.length - 1];
    if (lastRow.rawMaterialId !== '' && lastRow.volume !== '') {
      setRows(prev => [...prev, emptyRow()]);
    }
  }, [rows]);

  const addRow = () => {
    setRows(prev => [...prev, emptyRow()]);
  };

  const removeRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof IngredientRow, value: any) => {
    setRows(prev => prev.map((row, i) => {
      if (i !== index) return row;
      return { ...row, [field]: value };
    }));
  };

  const updateRowWithUomAutoSelect = (index: number, matId: number | '', customList?: RawMaterialDto[]) => {
    let autoUom = UOM.GRAM;
    if (matId !== '') {
      const listToSearch = customList || rawMaterials;
      const mat = listToSearch.find(m => m.id === matId);
      if (mat) {
        if (mat.measurementType === MeasurementType.WEIGHT) {
          autoUom = UOM.KILOGRAM;
        } else if (mat.measurementType === MeasurementType.VOLUME) {
          autoUom = UOM.LITER;
        } else if (mat.measurementType === MeasurementType.COUNT) {
          autoUom = UOM.PIECE;
        }
      }
    }
    setRows(prev => prev.map((row, i) => {
      if (i !== index) return row;
      return { ...row, rawMaterialId: matId, uom: autoUom };
    }));
  };

  const handleOpenQuickAdd = (rowIndex: number) => {
    const currentSearch = searchTerms[rowIndex] || '';
    setQuickAdd({
      rowIndex,
      rows: [{
        name: currentSearch,
        measurementType: MeasurementType.WEIGHT,
        category: '',
      }],
    });
  };

  const handleOpenQuickAddAtBottom = () => {
    let targetIndex = rows.length - 1;
    const lastRow = rows[rows.length - 1];
    if (lastRow && (lastRow.rawMaterialId !== '' || lastRow.volume !== '')) {
      setRows(prev => [...prev, emptyRow()]);
      targetIndex = rows.length;
    }
    setQuickAdd({
      rowIndex: targetIndex,
      rows: [{
        name: '',
        measurementType: MeasurementType.WEIGHT,
        category: '',
      }],
    });
  };

  const addQuickAddRow = () => {
    setQuickAdd(prev => {
      if (!prev) return null;
      return {
        ...prev,
        rows: [...prev.rows, { name: '', measurementType: MeasurementType.WEIGHT, category: '' }],
      };
    });
  };

  const removeQuickAddRow = (index: number) => {
    setQuickAdd(prev => {
      if (!prev) return null;
      return {
        ...prev,
        rows: prev.rows.filter((_, i) => i !== index),
      };
    });
  };

  const updateQuickAddRow = (index: number, field: keyof QuickAddRow, value: any) => {
    setQuickAdd(prev => {
      if (!prev) return null;
      return {
        ...prev,
        rows: prev.rows.map((row, i) => {
          if (i !== index) return row;
          return { ...row, [field]: value };
        }),
      };
    });
  };

  const handleSaveQuickAdd = async () => {
    if (!quickAdd || !subscriptionId) return;
    const validRows = quickAdd.rows.filter(r => r.name.trim() !== '');
    if (validRows.length === 0) return;

    setIsSavingQuickAdd(true);
    try {
      const payload = validRows.map(r => ({
        name: r.name.trim(),
        measurementType: r.measurementType,
        category: r.category.trim() || undefined,
      }));
      const response = await createRawMaterials(subscriptionId, payload);
      const updatedMaterials = await getRawMaterials(subscriptionId);
      setRawMaterials(updatedMaterials);

      const firstNewMaterial = response.data?.[0];
      const newMaterialId = firstNewMaterial ? firstNewMaterial.id : '';

      if (newMaterialId) {
        updateRowWithUomAutoSelect(quickAdd.rowIndex, newMaterialId, updatedMaterials);
        setSearchTerms(prev => ({ ...prev, [quickAdd.rowIndex]: '' }));
        setTimeout(() => {
          const volInput = document.getElementById(`volume-input-${quickAdd.rowIndex}`);
          if (volInput) volInput.focus();
        }, 80);
      }
      setQuickAdd(null);
    } catch (e) {
      console.error('Failed to quick-add raw materials', e);
    } finally {
      setIsSavingQuickAdd(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !subscriptionId) return;

    // Filter valid rows
    const validRows = rows.filter(r => r.rawMaterialId !== '' && r.volume !== '');
    if (validRows.length === 0) return;

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        subscriptionId,
        ingredients: validRows.map(r => ({
          rawMaterialId: r.rawMaterialId as number,
          volume: parseFloat(r.volume.replace(',', '.')),
          uom: r.uom,
        })),
      };

      if (recipeToEdit) {
        await updateRecipe(recipeToEdit.id, payload);
      } else {
        await createRecipe(payload);
      }
      onSave();
      onClose();
    } catch (e) {
      console.error('Failed to save recipe', e);
    } finally {
      setIsSaving(false);
    }
  };

  const validRows = rows.filter(r => r.rawMaterialId !== '' && r.volume !== '');
  const hasValidRows = validRows.length > 0;
  const hasInvalidRows = rows.some(r => 
    (r.rawMaterialId !== '' && r.volume === '') || 
    (r.rawMaterialId === '' && r.volume !== '')
  );
  const canSave = name.trim() !== '' && hasValidRows && !hasInvalidRows;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalFloristIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            {recipeToEdit ? `עריכת מתכון: ${recipeToEdit.name}` : 'יצירת מתכון חדש'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <TextField
              fullWidth
              label="שם המתכון"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ bgcolor: 'background.paper' }}
            />

            <Divider>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                רכיבי המתכון
              </Typography>
            </Divider>

            <Box display="flex" flexDirection="column" gap={2}>
              {rows.map((row, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2, position: 'relative' }}>
                  <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    {/* Raw Material Autocomplete */}
                    <Autocomplete
                      id={`raw-material-autocomplete-${index}`}
                      sx={{ flex: 2, minWidth: 200 }}
                      size="small"
                      options={rawMaterials}
                      autoHighlight
                      getOptionLabel={(option) => `${option.name}${option.category ? ` (${option.category})` : ''}`}
                      value={rawMaterials.find(m => m.id === row.rawMaterialId) || null}
                      onChange={(_, newValue) => {
                        const matId = newValue ? newValue.id : '';
                        updateRowWithUomAutoSelect(index, matId);
                        setSearchTerms(prev => ({ ...prev, [index]: '' }));
                        if (matId !== '') {
                          setTimeout(() => {
                            const volInput = document.getElementById(`volume-input-${index}`);
                            if (volInput) volInput.focus();
                          }, 50);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (e.defaultPrevented) {
                            return;
                          }
                          setTimeout(() => {
                            const volInput = document.getElementById(`volume-input-${index}`);
                            if (volInput) volInput.focus();
                          }, 50);
                        }
                      }}
                      onInputChange={(_, newInputValue, reason) => {
                        if (reason === 'input') {
                          setSearchTerms(prev => ({ ...prev, [index]: newInputValue }));
                        } else if (reason === 'clear') {
                          setSearchTerms(prev => ({ ...prev, [index]: '' }));
                        }
                      }}
                      loading={isLoadingMaterials}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="חומר גלם"
                          placeholder="חפש חומר גלם..."
                        />
                      )}
                      noOptionsText={
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1} p={1}>
                          <Typography variant="body2" color="text.secondary">
                            לא נמצאו חומרי גלם
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={<AddIcon />}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleOpenQuickAdd(index);
                              if (document.activeElement instanceof HTMLElement) {
                                document.activeElement.blur();
                              }
                            }}
                          >
                            צור חומר גלם חדש
                          </Button>
                        </Box>
                      }
                      loadingText="טוען..."
                    />

                    {/* Volume Input */}
                    <TextField
                      id={`volume-input-${index}`}
                      sx={{ flex: 1, minWidth: 100 }}
                      size="small"
                      label="כמות"
                      type="text"
                      inputMode="decimal"
                      value={row.volume}
                      onChange={(e) => {
                        const val = e.target.value.replace('ץ', '.').replace(/[^0-9.,]/g, '');
                        updateRow(index, 'volume', val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          setTimeout(() => {
                            const nextAutocomplete = document.getElementById(`raw-material-autocomplete-${index + 1}`);
                            if (nextAutocomplete) {
                              nextAutocomplete.focus();
                            }
                          }, 50);
                        }
                      }}
                    />

                    {/* UOM Select */}
                    <FormControl sx={{ flex: 1.2, minWidth: 120 }} size="small">
                      <InputLabel id={`uom-select-label-${index}`}>יחידת מידה</InputLabel>
                      <Select
                        labelId={`uom-select-label-${index}`}
                        value={row.uom}
                        label="יחידת מידה"
                        onChange={(e) => updateRow(index, 'uom', e.target.value)}
                      >
                        {Object.values(UOM).map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {UOM_hebrew_names[unit] || unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Remove Action */}
                    <IconButton
                      onClick={() => removeRow(index)}
                      disabled={rows.length === 1}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>

            {quickAdd !== null && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  borderColor: 'secondary.light',
                  borderStyle: 'dashed',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  mt: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} color="secondary.main" display="flex" alignItems="center" gap={0.5}>
                  <AutoAwesomeIcon fontSize="small" />
                  הוספת חומרי גלם חדשים למערכת
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {quickAdd.rows.map((qRow, qIndex) => (
                    <Box key={qIndex} display="flex" gap={2} alignItems="center" flexWrap="wrap">
                      <TextField
                        autoFocus={qIndex === 0 && qRow.name === ''}
                        label="שם חומר הגלם"
                        value={qRow.name}
                        onChange={(e) => updateQuickAddRow(qIndex, 'name', e.target.value)}
                        size="small"
                        required
                        sx={{ flex: 2, minWidth: 150, bgcolor: 'background.paper' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (qIndex === quickAdd.rows.length - 1) {
                              handleSaveQuickAdd();
                            }
                          }
                        }}
                      />
                      
                      <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
                        <InputLabel id={`quick-add-measurement-type-label-${qIndex}`}>סוג מדידה</InputLabel>
                        <Select
                          labelId={`quick-add-measurement-type-label-${qIndex}`}
                          label="סוג מדידה"
                          value={qRow.measurementType}
                          onChange={(e) => updateQuickAddRow(qIndex, 'measurementType', e.target.value as MeasurementType)}
                          sx={{ bgcolor: 'background.paper' }}
                        >
                          {Object.values(MeasurementType).map((type) => (
                            <MenuItem key={type} value={type}>
                              {MeasurementType_hebrew_names[type]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="קטגוריה (אופציונלי)"
                        value={qRow.category}
                        onChange={(e) => updateQuickAddRow(qIndex, 'category', e.target.value)}
                        size="small"
                        placeholder="קטגוריה"
                        sx={{ flex: 1.2, minWidth: 130, bgcolor: 'background.paper' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (qIndex === quickAdd.rows.length - 1) {
                              handleSaveQuickAdd();
                            }
                          }
                        }}
                      />

                      <IconButton
                        onClick={() => removeQuickAddRow(qIndex)}
                        disabled={quickAdd.rows.length === 1}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addQuickAddRow}
                    variant="text"
                    color="secondary"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  >
                    הוסף חומר גלם נוסף
                  </Button>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      disabled={isSavingQuickAdd || !quickAdd.rows.some(r => r.name.trim() !== '')}
                      onClick={handleSaveQuickAdd}
                      sx={{ borderRadius: 1.5, fontWeight: 600, px: 2 }}
                    >
                      {isSavingQuickAdd ? 'שומר...' : 'שמור'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setQuickAdd(null)}
                      sx={{ borderRadius: 1.5, px: 2 }}
                    >
                      ביטול
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}

            <Box display="flex" gap={2} mt={1} justifyContent="space-between" alignItems="center">
              <Button
                startIcon={<AddIcon />}
                onClick={addRow}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                הוסף רכיב
              </Button>

              <Button
                startIcon={<AutoAwesomeIcon />}
                onClick={handleOpenQuickAddAtBottom}
                variant="text"
                color="secondary"
                sx={{ fontWeight: 600 }}
              >
                הוסף חומר גלם חדש
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            ביטול
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isSaving || !canSave}
            sx={{ borderRadius: 2 }}
          >
            {isSaving ? 'שומר...' : (recipeToEdit ? 'עדכן מתכון' : 'שמור מתכון')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateRecipeDialog;
