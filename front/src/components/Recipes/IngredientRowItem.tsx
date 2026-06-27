import React, { useState, useEffect } from "react";
import { UOM, UOM_hebrew_names, MeasurementType } from "../../enums";
import { Autocomplete, FormControl, InputLabel, Select, MenuItem, IconButton, Paper, Box, Typography, Button, Grid } from "@mui/material";
import TextInput from "../Inputs/TextInput";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ReorderIcon from "@mui/icons-material/Reorder";
import { addRawMaterialConversion, type RawMaterialDto, type RawMaterialConversionDto } from "../../api/rawMaterial";

interface IngredientRow {
  rawMaterialId: number | "";
  volume: string;
  uom: UOM;
  customUom?: string;
}

interface IngredientRowItemProps {
  row: IngredientRow;
  index: number;
  rawMaterials: RawMaterialDto[];
  isLoadingMaterials: boolean;
  setSearchTerms: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onUpdateRow: (index: number, field: keyof IngredientRow, value: any) => void;
  onUpdateRowWithUomAutoSelect: (index: number, matId: number | "") => void;
  onRemoveRow: (index: number) => void;
  onOpenQuickAdd: (rowIndex: number) => void;
  onConversionAdded: (rawMaterialId: number, conversion: RawMaterialConversionDto) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  rowsCount: number;
}

const IngredientRowItem: React.FC<IngredientRowItemProps> = ({
  row,
  index,
  rawMaterials,
  isLoadingMaterials,
  setSearchTerms,
  onUpdateRow,
  onUpdateRowWithUomAutoSelect,
  onRemoveRow,
  onOpenQuickAdd,
  onConversionAdded,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging,
  rowsCount,
}) => {
  const [isCreatingCustomUom, setIsCreatingCustomUom] = useState(false);
  const [isEditingCustomUom, setIsEditingCustomUom] = useState(false);
  const [editingConversionId, setEditingConversionId] = useState<number | null>(null);
  const [customUomName, setCustomUomName] = useState("");
  const [customUomFactor, setCustomUomFactor] = useState("");
  const [customBaseUom, setCustomBaseUom] = useState("");
  const [dragAllowed, setDragAllowed] = useState(false);

  const selectedMaterial = rawMaterials.find((m) => m.id === row.rawMaterialId);

  useEffect(() => {
    if (selectedMaterial) {
      if (selectedMaterial.measurementType === MeasurementType.VOLUME) {
        setCustomBaseUom("milliliter");
      } else if (selectedMaterial.measurementType === MeasurementType.COUNT) {
        setCustomBaseUom("piece");
      } else {
        setCustomBaseUom("gram");
      }
    }
  }, [selectedMaterial]);

  const handleEditCustomUom = () => {
    const currentConv = selectedMaterial?.conversions?.find((c) => c.uomName === row.customUom);
    if (currentConv) {
      setCustomUomName(currentConv.uomName);
      setCustomUomFactor(String(currentConv.conversionFactor));
      setCustomBaseUom(currentConv.baseUom);
      setEditingConversionId(currentConv.id);
      setIsEditingCustomUom(true);
      setIsCreatingCustomUom(true);
    }
  };

  const handleSaveCustomUom = async () => {
    if (!row.rawMaterialId || !customUomName.trim() || !customUomFactor) return;
    try {
      const factor = parseFloat(customUomFactor);
      const newConv = await addRawMaterialConversion(row.rawMaterialId as number, {
        id: editingConversionId || undefined,
        uomName: customUomName.trim(),
        conversionFactor: factor,
        baseUom: customBaseUom,
      });
      onConversionAdded(row.rawMaterialId as number, newConv);
      onUpdateRow(index, "uom", UOM.CUSTOM);
      onUpdateRow(index, "customUom", newConv.uomName);
      setIsCreatingCustomUom(false);
      setIsEditingCustomUom(false);
      setEditingConversionId(null);
      setCustomUomName("");
      setCustomUomFactor("");
    } catch (err) {
      console.error("Failed to add custom conversion", err);
    }
  };

  const customConversions = selectedMaterial?.conversions || [];
  const currentSelectValue = row.uom === UOM.CUSTOM ? (row.customUom || "") : row.uom;

  return (
    <Paper
      variant="outlined"
      draggable={dragAllowed}
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      sx={{
        p: 2,
        borderRadius: 2,
        position: "relative",
        opacity: isDragging ? 0.4 : 1,
        border: isDragging ? "2px dashed #9c27b0" : "1px solid #e2e8f0",
        backgroundColor: isDragging ? "rgba(156, 39, 176, 0.05)" : "background.paper",
        transition: "all 0.2s ease",
      }}
    >
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        {/* Drag Handle */}
        <Box
          onMouseEnter={() => setDragAllowed(true)}
          onMouseLeave={() => setDragAllowed(false)}
          sx={{
            cursor: dragAllowed ? "grabbing" : "grab",
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
            flexShrink: 0,
            p: 0.5,
          }}
        >
          <ReorderIcon />
        </Box>

        {/* Raw Material Autocomplete */}
        <Autocomplete
          id={`raw-material-autocomplete-${index}`}
          sx={{ flex: 2, minWidth: 200 }}
          size="small"
          options={rawMaterials}
          autoHighlight
          getOptionLabel={(option) => `${option.name}${option.category ? ` (${option.category})` : ""}`}
          value={selectedMaterial || null}
          onChange={(_, newValue) => {
            const matId = newValue ? newValue.id : "";
            onUpdateRowWithUomAutoSelect(index, matId);
            setSearchTerms((prev) => ({ ...prev, [index]: "" }));
            setIsCreatingCustomUom(false);
            if (matId !== "") {
              setTimeout(() => {
                const volInput = document.getElementById(`volume-input-${index}`);
                if (volInput) volInput.focus();
              }, 50);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
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
            if (reason === "input") {
              setSearchTerms((prev) => ({ ...prev, [index]: newInputValue }));
            } else if (reason === "clear") {
              setSearchTerms((prev) => ({ ...prev, [index]: "" }));
            }
          }}
          loading={isLoadingMaterials}
          renderInput={(params) => <TextInput {...params} label="חומר גלם" placeholder="חפש חומר גלם..." />}
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
                  onOpenQuickAdd(index);
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
        <TextInput
          id={`volume-input-${index}`}
          sx={{ flex: 1, minWidth: 100 }}
          size="small"
          label="כמות"
          type="text"
          inputMode="decimal"
          value={row.volume}
          onChange={(e) => {
            const val = e.target.value.replace("ץ", ".").replace(/[^0-9.,]/g, "");
            onUpdateRow(index, "volume", val);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
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

        {/* UOM Select and Edit Button */}
        <Box display="flex" alignItems="center" gap={0.5} sx={{ flex: 1.2, minWidth: 160 }}>
          <FormControl fullWidth size="small">
            <InputLabel id={`uom-select-label-${index}`}>יחידת מידה</InputLabel>
            <Select
              labelId={`uom-select-label-${index}`}
              value={currentSelectValue}
              label="יחידת מידה"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "__ADD_CUSTOM__") {
                  setIsCreatingCustomUom(true);
                  setIsEditingCustomUom(false);
                  setCustomUomName("");
                  setCustomUomFactor("");
                } else {
                  setIsCreatingCustomUom(false);
                  setIsEditingCustomUom(false);
                  const isCustom = customConversions.some((c) => c.uomName === val);
                  if (isCustom) {
                    onUpdateRow(index, "uom", UOM.CUSTOM);
                    onUpdateRow(index, "customUom", val);
                  } else {
                    onUpdateRow(index, "uom", val as UOM);
                    onUpdateRow(index, "customUom", "");
                  }
                }
              }}
            >
              {/* Standard UOMs */}
              {Object.values(UOM).filter(unit => unit !== UOM.CUSTOM).map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {UOM_hebrew_names[unit] || unit}
                </MenuItem>
              ))}

              {/* Custom UOMs */}
              {customConversions.map((conv) => (
                <MenuItem key={conv.id} value={conv.uomName}>
                  {conv.uomName} (מותאם אישית)
                </MenuItem>
              ))}

              {/* Special Add Button */}
              {row.rawMaterialId !== "" && (
                <MenuItem value="__ADD_CUSTOM__" sx={{ color: "secondary.main", fontWeight: 600, borderTop: "1px solid #e2e8f0" }}>
                  + יחידה מותאמת אישית...
                </MenuItem>
              )}
            </Select>
          </FormControl>
          {row.uom === UOM.CUSTOM && row.customUom && (
            <IconButton
              size="small"
              onClick={handleEditCustomUom}
              color="primary"
              title="ערוך יחידה מותאמת אישית"
              sx={{ flexShrink: 0 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Remove Action */}
        <IconButton onClick={() => onRemoveRow(index)} disabled={rowsCount === 1} color="error" sx={{ flexShrink: 0, marginRight: "auto" }}>
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Elegant Responsive Grid Inline Custom UOM Form */}
      {isCreatingCustomUom && selectedMaterial && (
        <Grid container spacing={2} alignItems="center" sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: "#f8fafc", border: "1px dashed #cbd5e1", width: "100%", boxSizing: "border-box" }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextInput
              fullWidth
              size="small"
              label={isEditingCustomUom ? "עריכת שם היחידה" : "שם היחידה"}
              placeholder="כף, כוס..."
              value={customUomName}
              onChange={(e) => setCustomUomName(e.target.value)}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 1 }} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary">=</Typography>
          </Grid>
          
          <Grid size={{ xs: 4, sm: 2 }}>
            <TextInput
              fullWidth
              size="small"
              label="כמות"
              type="text"
              inputMode="decimal"
              value={customUomFactor}
              onChange={(e) => setCustomUomFactor(e.target.value.replace("ץ", ".").replace(/[^0-9.]/g, ""))}
            />
          </Grid>
          
          <Grid size={{ xs: 8, sm: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id={`custom-base-uom-label-${index}`}>יחידת בסיס</InputLabel>
              <Select
                labelId={`custom-base-uom-label-${index}`}
                id={`custom-base-uom-select-${index}`}
                value={customBaseUom}
                label="יחידת בסיס"
                onChange={(e) => setCustomBaseUom(e.target.value as string)}
                MenuProps={{ disablePortal: true }}
              >
                {selectedMaterial.measurementType === MeasurementType.VOLUME && (
                  <MenuItem value="milliliter">מיליליטר (מ״ל)</MenuItem>
                )}
                {selectedMaterial.measurementType === MeasurementType.VOLUME && (
                  <MenuItem value="liter">ליטר</MenuItem>
                )}
                {selectedMaterial.measurementType === MeasurementType.COUNT && (
                  <MenuItem value="piece">יחידה</MenuItem>
                )}
                {selectedMaterial.measurementType !== MeasurementType.VOLUME && selectedMaterial.measurementType !== MeasurementType.COUNT && (
                  <MenuItem value="gram">גרם (ג׳)</MenuItem>
                )}
                {selectedMaterial.measurementType !== MeasurementType.VOLUME && selectedMaterial.measurementType !== MeasurementType.COUNT && (
                  <MenuItem value="kilogram">קילוגרם (ק״ג)</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" }, gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setIsCreatingCustomUom(false);
                setIsEditingCustomUom(false);
                setEditingConversionId(null);
              }}
              sx={{ borderRadius: 1.5, borderColor: 'grey.300', color: 'text.secondary', py: 0.5 }}
            >
              ביטול
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveCustomUom}
              disabled={!customUomName.trim() || !customUomFactor || parseFloat(customUomFactor) <= 0}
              sx={{ borderRadius: 1.5, py: 0.5 }}
            >
              אישור
            </Button>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default IngredientRowItem;
