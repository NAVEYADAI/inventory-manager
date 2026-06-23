import { useEffect, useState } from 'react';
import { UOM, MeasurementType } from '../../enums';
import {
  Button, TextField, Box, Divider, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getRawMaterials, createRawMaterials, type RawMaterialDto } from '../../api/rawMaterial';
import { createRecipe, updateRecipe, type RecipeDto } from '../../api/recipe';
import IngredientRowItem from '../../components/Recipes/IngredientRowItem';
import QuickAddPanel, { type QuickAddRow } from '../../components/Recipes/QuickAddPanel';
import BaseDialog from '../../components/BaseDialog/BaseDialog';

interface IngredientRow {
  rawMaterialId: number | '';
  volume: string;
  uom: UOM;
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
