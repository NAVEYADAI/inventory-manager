import React, { useState } from "react";
import { MeasurementType, MeasurementType_hebrew_names } from "../../enums";
import { Box, Paper, Typography, Chip, FormControl, InputLabel, Select, MenuItem, IconButton, Button } from "@mui/material";
import TextInput from "../Inputs/TextInput";
import DeleteIcon from "@mui/icons-material/Delete";
import { type RawMaterialDto, updateRawMaterial } from "../../api/rawMaterial";
import { measurementTypeHints } from "./RawMaterialInputRow";

interface ExistingMaterialsEditorProps {
  existingMaterials: RawMaterialDto[];
  isLoading: boolean;
  onUpdateSuccess: () => void;
}

const ExistingMaterialsEditor: React.FC<ExistingMaterialsEditorProps> = ({
  existingMaterials,
  isLoading,
  onUpdateSuccess,
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<RawMaterialDto[]>([]);
  const [isUpdatingMaterial, setIsUpdatingMaterial] = useState(false);

  const toggleSelectedMaterial = (material: RawMaterialDto) => {
    setSelectedMaterials((prev) => {
      const alreadySelected = prev.some((selected) => selected.id === material.id);
      if (alreadySelected) return prev.filter((selected) => selected.id !== material.id);
      return [...prev, material];
    });
  };

  const updateSelectedMaterial = (id: number, field: keyof RawMaterialDto, value: unknown) => {
    setSelectedMaterials((prev) =>
      prev.map((material) => (material.id === id ? { ...material, [field]: value } : material)),
    );
  };

  const handleUpdateMaterial = async () => {
    if (selectedMaterials.length === 0) return;
    setIsUpdatingMaterial(true);
    try {
      await Promise.all(
        selectedMaterials
          .filter((material) => material.name.trim())
          .map((material) =>
            updateRawMaterial(material.id, {
              name: material.name.trim(),
              measurementType: material.measurementType,
              category: material.category?.trim() || undefined,
            }),
          ),
      );
      // Clear selections and refresh lists
      setSelectedMaterials([]);
      onUpdateSuccess();
    } catch (e) {
      console.error("Failed to update raw materials", e);
    } finally {
      setIsUpdatingMaterial(false);
    }
  };

  const sortedMaterials = [...existingMaterials].sort((a, b) => a.name.localeCompare(b.name, "he"));
  const groupedMaterials = sortedMaterials.reduce<Record<string, RawMaterialDto[]>>((acc, material) => {
    const categoryName = material.category?.trim() || "ללא קטגוריה";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(material);
    return acc;
  }, {});

  const orderedCategories = Object.keys(groupedMaterials)
    .filter((category) => category !== "ללא קטגוריה")
    .sort((a, b) => a.localeCompare(b, "he"));
  if (groupedMaterials["ללא קטגוריה"]) orderedCategories.push("ללא קטגוריה");

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fafafa" }}>
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        חומרי גלם קיימים בחברה
      </Typography>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          טוען נתונים...
        </Typography>
      ) : existingMaterials.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          עדיין אין חומרי גלם קיימים.
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1.25}>
          {orderedCategories.map((categoryName) => (
            <Box key={categoryName} display="flex" flexDirection="column" gap={0.75}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                {categoryName}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {groupedMaterials[categoryName].map((material) => (
                  <Chip
                    key={material.id}
                    variant={selectedMaterials.some((selected) => selected.id === material.id) ? "filled" : "outlined"}
                    onClick={() => toggleSelectedMaterial(material)}
                    icon={measurementTypeHints[material.measurementType].icon}
                    label={material.name}
                    sx={{
                      cursor: "pointer",
                      borderWidth: 1.5,
                      borderColor: `${measurementTypeHints[material.measurementType].color}.main`,
                      "& .MuiChip-icon": {
                        color: `${measurementTypeHints[material.measurementType].color}.main`,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {selectedMaterials.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 1.5, p: 1.25, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            עריכת חומרי גלם קיימים ({selectedMaterials.length})
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            {selectedMaterials.map((material) => (
              <Box key={material.id} display="flex" gap={1} alignItems="center" flexWrap="wrap">
                <TextInput
                  label="שם חומר גלם"
                  size="small"
                  value={material.name}
                  onChange={(e) => updateSelectedMaterial(material.id, "name", e.target.value)}
                  sx={{ minWidth: 180, flex: 2 }}
                />
                <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
                  <InputLabel id={`edit-measurement-type-label-${material.id}`}>סוג</InputLabel>
                  <Select
                    labelId={`edit-measurement-type-label-${material.id}`}
                    label="סוג"
                    value={material.measurementType}
                    onChange={(e) =>
                      updateSelectedMaterial(material.id, "measurementType", e.target.value as MeasurementType)
                    }
                  >
                    {Object.values(MeasurementType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {MeasurementType_hebrew_names[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextInput
                  label="קטגוריה"
                  size="small"
                  value={material.category ?? ""}
                  onChange={(e) => updateSelectedMaterial(material.id, "category", e.target.value)}
                  sx={{ minWidth: 160, flex: 1.4 }}
                />
                <IconButton onClick={() => setSelectedMaterials((prev) => prev.filter((m) => m.id !== material.id))}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Box display="flex" justifyContent="flex-end" mt={0.5}>
              <Button
                variant="contained"
                onClick={handleUpdateMaterial}
                disabled={isUpdatingMaterial || selectedMaterials.some((material) => !material.name.trim())}
              >
                שמור עדכון לכל הנבחרים
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Paper>
  );
};

export default ExistingMaterialsEditor;
export type { ExistingMaterialsEditorProps };
