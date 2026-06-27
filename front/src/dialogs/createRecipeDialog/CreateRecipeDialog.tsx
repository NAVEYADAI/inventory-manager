import { useEffect, useState } from 'react';
import { UOM, MeasurementType } from '../../enums';
import {
  Button, Box, Divider, Typography, FormControl, InputLabel, Select, MenuItem, Stack, Switch
} from '@mui/material';
import TextInput from '../../components/Inputs/TextInput';
import AddIcon from '@mui/icons-material/Add';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LayersIcon from '@mui/icons-material/Layers';
import { getRawMaterials, createRawMaterials, type RawMaterialDto } from '../../api/rawMaterial';
import { createRecipe, updateRecipe, type RecipeDto } from '../../api/recipe';
import IngredientRowItem from '../../components/Recipes/IngredientRowItem';
import QuickAddPanel, { type QuickAddRow } from '../../components/Recipes/QuickAddPanel';
import BaseDialog from '../../components/BaseDialog/BaseDialog';

interface IngredientRow {
  rawMaterialId: number | '';
  volume: string;
  uom: UOM;
  customUom?: string;
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
  customUom: '',
});

const CreateRecipeDialog = ({ open, onClose, onSave, subscriptionId, recipeToEdit }: Props) => {
  const [name, setName] = useState('');
  const [yieldType, setYieldType] = useState<'WEIGHT' | 'UNITS'>('WEIGHT');
  const [isIntermediate, setIsIntermediate] = useState(false);
  const [rows, setRows] = useState<IngredientRow[]>([emptyRow()]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterialDto[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerms, setSearchTerms] = useState<Record<number, string>>({});
  const [quickAdd, setQuickAdd] = useState<QuickAddState | null>(null);
  const [isSavingQuickAdd, setIsSavingQuickAdd] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
        setYieldType(recipeToEdit.yieldType || 'WEIGHT');
        setIsIntermediate(recipeToEdit.isIntermediate || false);
        setRows(recipeToEdit.recipe_product.map(p => ({
          rawMaterialId: p.raw_material.id,
          volume: String(p.volume),
          uom: p.uom,
          customUom: p.customUom || '',
        })));
      } else {
        setName('');
        setYieldType('WEIGHT');
        setIsIntermediate(false);
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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setRows(prev => {
      const next = [...prev];
      const temp = next[draggedIndex];
      next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, temp);
      return next;
    });
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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

  const handleConversionAdded = (rawMaterialId: number, conversion: any) => {
    setRawMaterials(prev => prev.map(mat => {
      if (mat.id !== rawMaterialId) return mat;
      const exists = mat.conversions?.some(c => c.id === conversion.id);
      const updatedConversions = exists
        ? mat.conversions?.map(c => c.id === conversion.id ? conversion : c)
        : [...(mat.conversions || []), conversion];
      return {
        ...mat,
        conversions: updatedConversions
      };
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

    const validRows = rows.filter(r => r.rawMaterialId !== '' && r.volume !== '');
    if (validRows.length === 0) return;

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        subscriptionId,
        yieldType,
        isIntermediate,
        ingredients: validRows.map(r => ({
          rawMaterialId: r.rawMaterialId as number,
          volume: parseFloat(r.volume.replace(',', '.')),
          uom: r.uom,
          customUom: r.uom === UOM.CUSTOM ? r.customUom : undefined,
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

  const actions = (
    <>
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
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={recipeToEdit ? `עריכת מתכון: ${recipeToEdit.name}` : 'יצירת מתכון חדש'}
      icon={<LocalFloristIcon color="primary" />}
      actions={actions}
      maxWidth="md"
    >
      <Box display="flex" flexDirection="column" gap={3} mt={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextInput
            fullWidth
            label="שם המתכון"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ bgcolor: 'background.paper', flex: 2 }}
          />

          <FormControl sx={{ minWidth: 220, flex: 1 }}>
            <InputLabel id="yield-type-select-label">סוג תוצר המתכון</InputLabel>
            <Select
              labelId="yield-type-select-label"
              value={yieldType}
              label="סוג תוצר המתכון"
              onChange={(e) => setYieldType(e.target.value as 'WEIGHT' | 'UNITS')}
            >
              <MenuItem value="WEIGHT">משקל (כמות משקל שקולה נטו)</MenuItem>
              <MenuItem value="UNITS">יחידות (כמות יחידות ספורה)</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: isIntermediate ? 'rgba(156, 39, 176, 0.04)' : '#f8fafc',
            border: '1px solid',
            borderColor: isIntermediate ? 'rgba(156, 39, 176, 0.2)' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease-in-out',
            mt: -1,
            mb: 1,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} sx={{ width: '85%' }}>
            <LayersIcon sx={{ color: isIntermediate ? 'secondary.main' : 'text.secondary', fontSize: 28, flexShrink: 0 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color={isIntermediate ? 'secondary.main' : 'text.primary'}>
                הפוך לתוצר ביניים (מתכון משנה)
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, lineHeight: 1.4 }}>
                הפעל אפשרות זו כדי שתוכל להשתמש במתכון זה כרכיב (חומר גלם) בתוך מתכונים אחרים במערכת.
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={isIntermediate}
            onChange={(e) => setIsIntermediate(e.target.checked)}
            disabled={isSaving}
            color="secondary"
          />
        </Box>

        <Divider>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            רכיבי המתכון
          </Typography>
        </Divider>

        <Box display="flex" flexDirection="column" gap={2}>
          {rows.map((row, index) => (
            <IngredientRowItem
              key={index}
              row={row}
              index={index}
              rawMaterials={rawMaterials}
              isLoadingMaterials={isLoadingMaterials}
              setSearchTerms={setSearchTerms}
              onUpdateRow={updateRow}
              onUpdateRowWithUomAutoSelect={updateRowWithUomAutoSelect}
              onRemoveRow={removeRow}
              onOpenQuickAdd={handleOpenQuickAdd}
              onConversionAdded={handleConversionAdded}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
              isDragging={draggedIndex === index}
              rowsCount={rows.length}
            />
          ))}
        </Box>

        {quickAdd !== null && (
          <QuickAddPanel
            rows={quickAdd.rows}
            isSavingQuickAdd={isSavingQuickAdd}
            onUpdateQuickAddRow={updateQuickAddRow}
            onAddQuickAddRow={addQuickAddRow}
            onRemoveQuickAddRow={removeQuickAddRow}
            onSaveQuickAdd={handleSaveQuickAdd}
            onCancel={() => setQuickAdd(null)}
          />
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
    </BaseDialog>
  );
};

export default CreateRecipeDialog;
