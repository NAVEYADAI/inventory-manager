import React, { type ReactElement } from "react";
import { MeasurementType, MeasurementType_hebrew_names } from "../../enums";
import { Box, Paper, Tooltip, Chip, FormControl, InputLabel, Select, MenuItem, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ScaleIcon from "@mui/icons-material/Scale";
import OpacityIcon from "@mui/icons-material/Opacity";
import CategoryIcon from "@mui/icons-material/Category";

interface RawMaterialRow {
  name: string;
  measurementType: MeasurementType;
  category: string;
}

interface RawMaterialInputRowProps {
  row: RawMaterialRow;
  index: number;
  onUpdateRow: (index: number, field: keyof RawMaterialRow, value: any) => void;
  onRemoveRow: (index: number) => void;
  disableDelete: boolean;
}

export const measurementTypeHints: Record<
  MeasurementType,
  { text: string; color: "warning" | "secondary" | "success"; icon: ReactElement }
> = {
  [MeasurementType.WEIGHT]: {
    text: "לחומרים שנמדדים במשקל, כמו קמח/סוכר",
    color: "warning",
    icon: <ScaleIcon fontSize="small" />,
  },
  [MeasurementType.VOLUME]: {
    text: "לחומרים בנפח, כמו מים/שמן/חלב",
    color: "secondary",
    icon: <OpacityIcon fontSize="small" />,
  },
  [MeasurementType.COUNT]: {
    text: "לחומרים נספרים, כמו ביצים או יחידות",
    color: "success",
    icon: <CategoryIcon fontSize="small" />,
  },
};

const RawMaterialInputRow: React.FC<RawMaterialInputRowProps> = ({
  row,
  index,
  onUpdateRow,
  onRemoveRow,
  disableDelete,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Box display="flex" flexDirection="column" gap={1.25}>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} alignItems={{ xs: "stretch", sm: "center" }}>
          <Box sx={{ width: { xs: "100%", sm: 96 }, display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
            <Tooltip title={measurementTypeHints[row.measurementType].text} arrow>
              <Chip
                size="small"
                color={measurementTypeHints[row.measurementType].color}
                icon={measurementTypeHints[row.measurementType].icon}
                label={MeasurementType_hebrew_names[row.measurementType]}
                variant="filled"
                sx={{ width: "100%" }}
              />
            </Tooltip>
          </Box>

          <FormControl sx={{ flex: 1.2, width: "100%" }} size="small">
            <InputLabel id={`measurement-type-label-${index}`}>סוג</InputLabel>
            <Select
              labelId={`measurement-type-label-${index}`}
              value={row.measurementType}
              label="סוג"
              onChange={(e) => onUpdateRow(index, "measurementType", e.target.value as MeasurementType)}
            >
              {Object.values(MeasurementType).map((type) => (
                <MenuItem key={type} value={type}>
                  {MeasurementType_hebrew_names[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            sx={{ flex: 2, width: "100%" }}
            size="small"
            fullWidth
            label="שם חומר גלם"
            value={row.name}
            onChange={(e) => onUpdateRow(index, "name", e.target.value)}
          />

          <TextField
            sx={{ flex: 1.4, width: "100%" }}
            size="small"
            fullWidth
            label="קטגוריה"
            value={row.category}
            onChange={(e) => onUpdateRow(index, "category", e.target.value)}
          />

          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => onRemoveRow(index)} disabled={disableDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default RawMaterialInputRow;
export type { RawMaterialRow };
