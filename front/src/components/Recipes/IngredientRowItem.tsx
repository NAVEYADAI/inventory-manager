import React from "react";
import { UOM, UOM_hebrew_names } from "../../enums";
import { Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Paper, Box, Typography, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { type RawMaterialDto } from "../../api/rawMaterial";

interface IngredientRow {
  rawMaterialId: number | "";
  volume: string;
  uom: UOM;
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
  rowsCount,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, position: "relative" }}>
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        {/* Raw Material Autocomplete */}
        <Autocomplete
          id={`raw-material-autocomplete-${index}`}
          sx={{ flex: 2, minWidth: 200 }}
          size="small"
          options={rawMaterials}
          autoHighlight
          getOptionLabel={(option) => `${option.name}${option.category ? ` (${option.category})` : ""}`}
          value={rawMaterials.find((m) => m.id === row.rawMaterialId) || null}
          onChange={(_, newValue) => {
            const matId = newValue ? newValue.id : "";
            onUpdateRowWithUomAutoSelect(index, matId);
            setSearchTerms((prev) => ({ ...prev, [index]: "" }));
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
          renderInput={(params) => <TextField {...params} label="חומר גלם" placeholder="חפש חומר גלם..." />}
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
        <TextField
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

        {/* UOM Select */}
        <FormControl sx={{ flex: 1.2, minWidth: 120 }} size="small">
          <InputLabel id={`uom-select-label-${index}`}>יחידת מידה</InputLabel>
          <Select
            labelId={`uom-select-label-${index}`}
            value={row.uom}
            label="יחידת מידה"
            onChange={(e) => onUpdateRow(index, "uom", e.target.value as UOM)}
          >
            {Object.values(UOM).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {UOM_hebrew_names[unit] || unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Remove Action */}
        <IconButton onClick={() => onRemoveRow(index)} disabled={rowsCount === 1} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default IngredientRowItem;
