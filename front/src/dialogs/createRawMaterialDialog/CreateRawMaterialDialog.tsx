import { useEffect, useState } from 'react';
import { MeasurementType } from '../../enums';
import {
    Button, Box, Divider, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getRawMaterials, type RawMaterialDto } from '../../api/rawMaterial';
import ExistingMaterialsEditor from '../../components/RawMaterials/ExistingMaterialsEditor';
import RawMaterialInputRow, { type RawMaterialRow } from '../../components/RawMaterials/RawMaterialInputRow';
import BaseDialog from '../../components/BaseDialog/BaseDialog';

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (rows: RawMaterialRow[]) => void;
    subscriptionId?: number;
}

const emptyRow = (): RawMaterialRow => ({
    name: '',
    measurementType: MeasurementType.WEIGHT,
    category: '',
});

const CreateRawMaterialDialog = ({ open, onClose, onSave, subscriptionId }: Props) => {
    const [rows, setRows] = useState<RawMaterialRow[]>([emptyRow()]);
    const [existingMaterials, setExistingMaterials] = useState<RawMaterialDto[]>([]);
    const [isLoadingExisting, setIsLoadingExisting] = useState(false);

    const loadExistingMaterials = () => {
        if (!subscriptionId) return;
        let isCancelled = false;
        setIsLoadingExisting(true);
        getRawMaterials(subscriptionId)
            .then((materials) => {
                if (!isCancelled) {
                    setExistingMaterials(materials);
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

    const handleSave = () => {
        onSave(rows.filter(r => r.name.trim() !== ''));
        setRows([emptyRow()]);
        onClose();
    };

    const actions = (
        <>
            <Button onClick={onClose}>ביטול</Button>
            <Button onClick={handleSave} variant="contained">שמור</Button>
        </>
    );

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            title="הוספת חומרי גלם"
            subtitle="אפשר להוסיף כמה שורות ביחד. בשלב הזה בוחרים רק סוג מדידה."
            actions={actions}
            maxWidth="md"
        >
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
                <ExistingMaterialsEditor
                    existingMaterials={existingMaterials}
                    isLoading={isLoadingExisting}
                    onUpdateSuccess={loadExistingMaterials}
                />

                <Box display={{ xs: 'none', sm: 'flex' }} gap={2} alignItems="center">
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

                <Divider sx={{ display: { xs: 'none', sm: 'block' } }} />

                {rows.map((row, index) => (
                    <RawMaterialInputRow
                        key={index}
                        row={row}
                        index={index}
                        onUpdateRow={updateRow}
                        onRemoveRow={removeRow}
                        disableDelete={rows.length === 1}
                    />
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
        </BaseDialog>
    );
};

export default CreateRawMaterialDialog;