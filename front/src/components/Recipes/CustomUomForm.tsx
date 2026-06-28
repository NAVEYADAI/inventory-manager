import React from "react";
import { Autocomplete, FormControl, InputLabel, Select, MenuItem, Typography, Button, Grid } from "@mui/material";
import TextInput from "../Inputs/TextInput";
import { MeasurementType } from "../../enums";
import type { RawMaterialDto } from "../../api/rawMaterial";
import { FormGridContainer, ActionsGridItem } from "./CustomUomForm.style";

interface CustomUomFormProps {
  index: number;
  selectedMaterial: RawMaterialDto;
  isEditingCustomUom: boolean;
  existingCustomUomNames: string[];
  customUomName: string;
  setCustomUomName: (val: string) => void;
  customUomFactor: string;
  setCustomUomFactor: (val: string) => void;
  customBaseUom: string;
  setCustomBaseUom: (val: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const CustomUomForm: React.FC<CustomUomFormProps> = ({
  index,
  selectedMaterial,
  isEditingCustomUom,
  existingCustomUomNames,
  customUomName,
  setCustomUomName,
  customUomFactor,
  setCustomUomFactor,
  customBaseUom,
  setCustomBaseUom,
  onCancel,
  onSave,
}) => {
  return (
    <FormGridContainer
      container
      spacing={2}
      alignItems="center"
    >
      <Grid size={{ xs: 12, sm: 3 }}>
        <Autocomplete
          freeSolo
          options={existingCustomUomNames}
          value={customUomName}
          onChange={(_, newValue) => {
            setCustomUomName(newValue || "");
          }}
          onInputChange={(_, newInputValue) => {
            setCustomUomName(newInputValue);
          }}
          renderInput={(params) => (
            <TextInput
              {...params}
              fullWidth
              size="small"
              label={isEditingCustomUom ? "עריכת שם היחידה" : "שם היחידה"}
              placeholder="כף, כוס..."
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 1 }} sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">
          =
        </Typography>
      </Grid>

      <Grid size={{ xs: 4, sm: 2 }}>
        <TextInput
          fullWidth
          size="small"
          label="כמות"
          type="text"
          inputMode="decimal"
          value={customUomFactor}
          onChange={(e) =>
            setCustomUomFactor(e.target.value.replace("ץ", ".").replace(/[^0-9.]/g, ""))
          }
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
            {selectedMaterial.measurementType !== MeasurementType.VOLUME &&
              selectedMaterial.measurementType !== MeasurementType.COUNT && (
                <MenuItem value="gram">גרם (ג׳)</MenuItem>
              )}
            {selectedMaterial.measurementType !== MeasurementType.VOLUME &&
              selectedMaterial.measurementType !== MeasurementType.COUNT && (
                <MenuItem value="kilogram">קילוגרם (ק״ג)</MenuItem>
              )}
          </Select>
        </FormControl>
      </Grid>

      <ActionsGridItem
        size={{ xs: 12, sm: 3 }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={onCancel}
          sx={{ borderRadius: 1.5, borderColor: "grey.300", color: "text.secondary", py: 0.5 }}
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={onSave}
          disabled={
            !customUomName.trim() || !customUomFactor || parseFloat(customUomFactor) <= 0
          }
          sx={{ borderRadius: 1.5, py: 0.5 }}
        >
          אישור
        </Button>
      </ActionsGridItem>
    </FormGridContainer>
  );
};

export default CustomUomForm;
