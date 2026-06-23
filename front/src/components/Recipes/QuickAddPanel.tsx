import React from "react";
import { MeasurementType, MeasurementType_hebrew_names } from "../../enums";
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Paper, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface QuickAddRow {
  name: string;
  measurementType: MeasurementType;
  category: string;
}

interface QuickAddPanelProps {
  rows: QuickAddRow[];
  isSavingQuickAdd: boolean;
  onUpdateQuickAddRow: (index: number, field: keyof QuickAddRow, value: any) => void;
  onAddQuickAddRow: () => void;
  onRemoveQuickAddRow: (index: number) => void;
  onSaveQuickAdd: () => void;
  onCancel: () => void;
}

const QuickAddPanel: React.FC<QuickAddPanelProps> = ({
  rows,
  isSavingQuickAdd,
  onUpdateQuickAddRow,
  onAddQuickAddRow,
  onRemoveQuickAddRow,
  onSaveQuickAdd,
  onCancel,
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "action.hover",
        borderColor: "secondary.light",
        borderStyle: "dashed",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        mt: 1,
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} color="secondary.main" display="flex" alignItems="center" gap={0.5}>
        <AutoAwesomeIcon fontSize="small" />
        הוספת חומרי גלם חדשים למערכת
      </Typography>

      <Box display="flex" flexDirection="column" gap={1.5}>
        {rows.map((qRow, qIndex) => (
          <Box key={qIndex} display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              autoFocus={qIndex === 0 && qRow.name === ""}
              label="שם חומר הגלם"
              value={qRow.name}
              onChange={(e) => onUpdateQuickAddRow(qIndex, "name", e.target.value)}
              size="small"
              required
              sx={{ flex: 2, minWidth: 150, bgcolor: "background.paper" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (qIndex === rows.length - 1) {
                    onSaveQuickAdd();
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
                onChange={(e) => onUpdateQuickAddRow(qIndex, "measurementType", e.target.value as MeasurementType)}
                sx={{ bgcolor: "background.paper" }}
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
              onChange={(e) => onUpdateQuickAddRow(qIndex, "category", e.target.value)}
              size="small"
              placeholder="קטגוריה"
              sx={{ flex: 1.2, minWidth: 130, bgcolor: "background.paper" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (qIndex === rows.length - 1) {
                    onSaveQuickAdd();
                  }
                }
              }}
            />

            <IconButton onClick={() => onRemoveQuickAddRow(qIndex)} disabled={rows.length === 1} color="error" size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
        <Button
          startIcon={<AddIcon />}
          onClick={onAddQuickAddRow}
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
            disabled={isSavingQuickAdd || !rows.some((r) => r.name.trim() !== "")}
            onClick={onSaveQuickAdd}
            sx={{ borderRadius: 1.5, fontWeight: 600, px: 2 }}
          >
            {isSavingQuickAdd ? "שומר..." : "שמור"}
          </Button>
          <Button variant="outlined" size="small" onClick={onCancel} sx={{ borderRadius: 1.5, px: 2 }}>
            ביטול
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuickAddPanel;
export type { QuickAddRow };
