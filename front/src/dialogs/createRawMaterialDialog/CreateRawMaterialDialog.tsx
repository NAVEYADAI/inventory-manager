import { type ReactElement, useEffect, useState } from 'react';
import { MeasurementType, MeasurementType_hebrew_names } from '@inventory-manager/shared';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, Box,
    MenuItem, Select, FormControl, InputLabel,
    Divider, Typography, Paper, Chip, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ScaleIcon from '@mui/icons-material/Scale';
import OpacityIcon from '@mui/icons-material/Opacity';
import CategoryIcon from '@mui/icons-material/Category';
import { getRawMaterials, type RawMaterialDto, updateRawMaterial } from '../../api/rawMaterial';

interface RawMaterialRow {
    name: string;
    measurementType: MeasurementType;
    category: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (rows: RawMaterialRow[]) => void;
    subscriptionId?: number;
}

const measurementTypeHints: Record<MeasurementType, { text: string; color: 'warning' | 'secondary' | 'success'; icon: ReactElement }> = {
    [MeasurementType.WEIGHT]: {
        text: 'לחומרים שנמדדים במשקל, כמו קמח/סוכר',
        color: 'warning',
        icon: <ScaleIcon fontSize="small" />,
    },
    [MeasurementType.VOLUME]: {
        text: 'לחומרים בנפח, כמו מים/שמן/חלב',
        color: 'secondary',
        icon: <OpacityIcon fontSize="small" />,
    },
    [MeasurementType.COUNT]: {
        text: 'לחומרים נספרים, כמו ביצים או יחידות',
        color: 'success',
        icon: <CategoryIcon fontSize="small" />,
    },
};

const emptyRow = (): RawMaterialRow => ({
    name: '',
    measurementType: MeasurementType.WEIGHT,
    category: '',
});

const CreateRawMaterialDialog = ({ open, onClose, onSave, subscriptionId }: Props) => {
    const [rows, setRows] = useState<RawMaterialRow[]>([emptyRow()]);
    const [existingMaterials, setExistingMaterials] = useState<RawMaterialDto[]>([]);
    const [isLoadingExisting, setIsLoadingExisting] = useState(false);
    const [selectedMaterials, setSelectedMaterials] = useState<RawMaterialDto[]>([]);
    const [isUpdatingMaterial, setIsUpdatingMaterial] = useState(false);

    const loadExistingMaterials = () => {
        if (!subscriptionId) return;
        let isCancelled = false;
        setIsLoadingExisting(true);
        getRawMaterials(subscriptionId)
            .then((materials) => {
                if (!isCancelled) {
                    setExistingMaterials(materials);
                    setSelectedMaterials((prevSelected) =>
                        prevSelected
                            .map((selected) => materials.find((m) => m.id === selected.id))
                            .filter((item): item is RawMaterialDto => Boolean(item)),
                    );
                }
            })
            .catch(() => {
                if (!isCancelled) setExistingMaterials([]);
            })
            .finally(() => {
                if (!isCancelled) setIsLoadingExisting(false);
            });
        return () => {
            isCancelled = true;
        };
    };

    const updateRow = (index: number, field: keyof RawMaterialRow, value: any) => {
        setRows(prev => prev.map((row, i) => {
            if (i !== index) return row;
            return { ...row, [field]: value };
        }));
    };

    const addRows = (count: number) => {
        const amount = Math.max(1, count);
        setRows(prev => [...prev, ...Array.from({ length: amount }, () => emptyRow())]);
    };

    const addRow = () => addRows(1);
    const removeRow = (index: number) => setRows(prev => prev.filter((_, i) => i !== index));

    useEffect(() => {
        if (!open || !subscriptionId) return;
        return loadExistingMaterials();
    }, [open, subscriptionId]);

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
            loadExistingMaterials();
        } finally {
            setIsUpdatingMaterial(false);
        }
    };

    const sortedMaterials = [...existingMaterials].sort((a, b) => a.name.localeCompare(b.name, 'he'));
    const groupedMaterials = sortedMaterials.reduce<Record<string, RawMaterialDto[]>>((acc, material) => {
        const categoryName = material.category?.trim() || 'ללא קטגוריה';
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(material);
        return acc;
    }, {});
    const orderedCategories = Object.keys(groupedMaterials)
        .filter((category) => category !== 'ללא קטגוריה')
        .sort((a, b) => a.localeCompare(b, 'he'));
    if (groupedMaterials['ללא קטגוריה']) orderedCategories.push('ללא קטגוריה');

    const handleSave = () => {
        onSave(rows.filter(r => r.name.trim() !== ''));
        setRows([emptyRow()]);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={700}>הוספת חומרי גלם</Typography>
                <Typography variant="body2" color="text.secondary">
                    אפשר להוסיף כמה שורות ביחד. בשלב הזה בוחרים רק סוג מדידה.
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fafafa' }}>
                        <Typography variant="subtitle2" fontWeight={700} mb={1}>
                            חומרי גלם קיימים בחברה
                        </Typography>
                        {isLoadingExisting ? (
                            <Typography variant="body2" color="text.secondary">טוען נתונים...</Typography>
                        ) : existingMaterials.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">עדיין אין חומרי גלם קיימים.</Typography>
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
                                                    variant={selectedMaterials.some((selected) => selected.id === material.id) ? 'filled' : 'outlined'}
                                                    onClick={() => toggleSelectedMaterial(material)}
                                                    icon={measurementTypeHints[material.measurementType].icon}
                                                    label={material.name}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        borderWidth: 1.5,
                                                        borderColor: `${measurementTypeHints[material.measurementType].color}.main`,
                                                        '& .MuiChip-icon': {
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
                                            <TextField
                                                label="שם חומר גלם"
                                                size="small"
                                                value={material.name}
                                                onChange={(e) => updateSelectedMaterial(material.id, 'name', e.target.value)}
                                                sx={{ minWidth: 180, flex: 2 }}
                                            />
                                            <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
                                                <InputLabel id={`edit-measurement-type-label-${material.id}`}>סוג</InputLabel>
                                                <Select
                                                    labelId={`edit-measurement-type-label-${material.id}`}
                                                    label="סוג"
                                                    value={material.measurementType}
                                                    onChange={(e) =>
                                                        updateSelectedMaterial(material.id, 'measurementType', e.target.value as MeasurementType)
                                                    }
                                                >
                                                    {Object.values(MeasurementType).map((type) => (
                                                        <MenuItem key={type} value={type}>{MeasurementType_hebrew_names[type]}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                label="קטגוריה"
                                                size="small"
                                                value={material.category ?? ''}
                                                onChange={(e) => updateSelectedMaterial(material.id, 'category', e.target.value)}
                                                sx={{ minWidth: 160, flex: 1.4 }}
                                            />
                                            <IconButton
                                                onClick={() => setSelectedMaterials((prev) => prev.filter((m) => m.id !== material.id))}
                                            >
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

                    <Box display="flex" gap={2} alignItems="center">
                        <Typography sx={{ width: 96 }} textAlign="right" variant="caption" color="text.secondary">
                            חיווי
                        </Typography>
                        <Typography sx={{ flex: 1 }} textAlign="right" variant="caption" color="text.secondary">
                            סוג מדידה
                        </Typography>

                        <Typography sx={{ flex: 2 }} textAlign="right" variant="caption" color="text.secondary">
                            שם
                        </Typography>

                        <Typography sx={{ flex: 1.4 }} textAlign="right" variant="caption" color="text.secondary">
                            קטגוריה
                        </Typography>

                        <Box sx={{ width: 32 }} />
                    </Box>

                    <Divider />

                    {rows.map((row, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                            <Box display="flex" flexDirection="column" gap={1.25}>
                                <Box display="flex" gap={2} alignItems="center">
                                    <Box sx={{ width: 96, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Tooltip title={measurementTypeHints[row.measurementType].text} arrow>
                                            <Chip
                                                size="small"
                                                color={measurementTypeHints[row.measurementType].color}
                                                icon={measurementTypeHints[row.measurementType].icon}
                                                label={MeasurementType_hebrew_names[row.measurementType]}
                                                variant="filled"
                                                sx={{ width: '100%' }}
                                            />
                                        </Tooltip>
                                    </Box>

                                    <FormControl sx={{ flex: 1.2 }} size="small">
                                        <InputLabel id={`measurement-type-label-${index}`}>סוג</InputLabel>
                                        <Select
                                            labelId={`measurement-type-label-${index}`}
                                            value={row.measurementType}
                                            label="סוג"
                                            onChange={(e) => updateRow(index, 'measurementType', e.target.value as MeasurementType)}
                                        >
                                            {Object.values(MeasurementType).map((type) => (
                                                <MenuItem key={type} value={type}>{MeasurementType_hebrew_names[type]}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        sx={{ flex: 2 }}
                                        size="small"
                                        fullWidth
                                        label="שם חומר גלם"
                                        value={row.name}
                                        onChange={(e) => updateRow(index, 'name', e.target.value)}
                                    />

                                    <TextField
                                        sx={{ flex: 1.4 }}
                                        size="small"
                                        fullWidth
                                        label="קטגוריה"
                                        value={row.category}
                                        onChange={(e) => updateRow(index, 'category', e.target.value)}
                                    />

                                    <IconButton onClick={() => removeRow(index)} disabled={rows.length === 1}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>
                    ))}

                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Button startIcon={<AddIcon />} onClick={addRow} variant="outlined">
                            הוסף שורה
                        </Button>
                        <Button onClick={() => addRows(3)} variant="text">
                            +3 שורות
                        </Button>
                        <Button onClick={() => addRows(5)} variant="text">
                            +5 שורות
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleSave} variant="contained">שמור</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateRawMaterialDialog;