import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Stack,
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTag, updateTag, deleteTag, type TagDto } from '../../api/tag';
import BaseDialog from '../../components/BaseDialog/BaseDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  subscriptionId?: number;
  tagToEdit?: TagDto | null;
  prefilledData?: { name: string; startDate: string; endDate: string } | null;
}

const CreateTagDialog = ({ open, onClose, onSave, subscriptionId, tagToEdit, prefilledData }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (tagToEdit) {
      setName(tagToEdit.name);
      setDescription(tagToEdit.description || '');
      setStartDate(tagToEdit.startDate ? tagToEdit.startDate.substring(0, 10) : '');
      setEndDate(tagToEdit.endDate ? tagToEdit.endDate.substring(0, 10) : '');
    } else if (prefilledData) {
      setName(prefilledData.name);
      setDescription('');
      setStartDate(prefilledData.startDate);
      setEndDate(prefilledData.endDate);
    } else {
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    }
    setError('');
  }, [open, tagToEdit, prefilledData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('אנא הזן שם לתג');
      return;
    }
    if (!startDate || !endDate) {
      setError('אנא בחר תאריך התחלה ותאריך סיום');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('תאריך התחלה לא יכול להיות מאוחר מתאריך סיום');
      return;
    }
    if (!subscriptionId) return;

    setSubmitting(true);
    setError('');

    try {
      if (tagToEdit) {
        await updateTag(tagToEdit.id, {
          name,
          description,
          startDate,
          endDate,
        });
      } else {
        await createTag({
          name,
          description,
          startDate,
          endDate,
          subscriptionId,
        });
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Failed to save tag', err);
      setError(err?.response?.data?.message || 'שגיאה בשמירת התג');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!tagToEdit) return;
    if (!window.confirm('האם אתה בטוח שברצונך למחוק תג זה?')) return;

    setDeleting(true);
    setError('');

    try {
      await deleteTag(tagToEdit.id);
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Failed to delete tag', err);
      setError('שגיאה במחיקת התג');
    } finally {
      setDeleting(false);
    }
  };

  const actions = (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box>
        {tagToEdit && (
          <Button
            onClick={handleDelete}
            variant="outlined"
            color="error"
            disabled={submitting || deleting}
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 2 }}
          >
            {deleting ? 'מוחק...' : 'מחק תג'}
          </Button>
        )}
      </Box>
      <Box display="flex" gap={1.5}>
        <Button onClick={onClose} disabled={submitting || deleting} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
          ביטול
        </Button>
        <Button
          type="submit"
          disabled={submitting || deleting || !name.trim() || !startDate || !endDate}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          }}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : tagToEdit ? 'עדכן תג' : 'צור תג'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={tagToEdit ? `עריכת תג: ${tagToEdit.name}` : 'יצירת תג חדש בלוח השנה'}
      subtitle={tagToEdit ? `מזהה תג: #${tagToEdit.id}` : 'סמן טווח תאריכים מרוכז לחישוב כמויות'}
      icon={<DateRangeIcon color="primary" sx={{ fontSize: 32 }} />}
      actions={actions}
      maxWidth="sm"
      onSubmit={handleSubmit}
    >
      <Box display="flex" flexDirection="column" gap={3}>
        {error && (
          <Typography color="error" variant="body2" sx={{ textAlign: 'center', fontWeight: 600 }}>
            {error}
          </Typography>
        )}

        <TextField
          label="שם התג"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting || deleting}
          fullWidth
          required
          placeholder="למשל: סבב פסח, שבוע ייצור יוני"
        />

        <TextField
          label="תיאור (אופציונלי)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting || deleting}
          fullWidth
          multiline
          rows={2}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="תאריך התחלה"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={submitting || deleting}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="תאריך סיום"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={submitting || deleting}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Box>
    </BaseDialog>
  );
};

export default CreateTagDialog;
