import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Stack,
  CardContent,
} from '@mui/material';
import {
  TagsContainer,
  TagsHeader,
  TagCard,
  CreateTagButton,
} from './TagsPage.style';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { getTags, type TagDto } from '../../api/tag';
import CreateTagDialog from '../../dialogs/createTagDialog/CreateTagDialog';
import TagSummaryDialog from '../../dialogs/tagSummaryDialog/TagSummaryDialog';

const dateFormatter = new Intl.DateTimeFormat('he-IL', {
  dateStyle: 'medium',
});

const TagsPage = () => {
  const [tags, setTags] = useState<TagDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagDto | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Retrieve current subscriptionId
  const userStr = localStorage.getItem("user");
  let subscriptionId: number | undefined = undefined;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      subscriptionId = user.selectedCompany?.subscriptionId;
    } catch { }
  }

  const loadTags = useCallback(async () => {
    if (!subscriptionId) return;
    setIsLoading(true);
    try {
      const data = await getTags(subscriptionId);
      setTags(data);
    } catch (e) {
      console.error('Failed to load tags', e);
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionId]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleOpenSummary = (tag: TagDto) => {
    setSelectedTag(tag);
    setIsSummaryOpen(true);
  };

  const handleOpenEdit = (tag: TagDto, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTag(tag);
    setIsCreateOpen(true);
  };

  const formatDateRange = (tag: TagDto) => {
    try {
      return `${dateFormatter.format(new Date(tag.startDate))} – ${dateFormatter.format(new Date(tag.endDate))}`;
    } catch {
      return '';
    }
  };

  return (
    <TagsContainer dir="rtl">
      {/* Header section */}
      <TagsHeader elevation={0}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ width: "100%", justifyContent: { xs: "center", sm: "flex-start" } }}>
          <AnalyticsIcon sx={{ fontSize: 40 }} />
          <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
            <Typography variant="h4" fontWeight={700}>דוחות ייצור ותקופות</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              עקוב וסכם כמויות ייצור וחומרי גלם לפי תקופות מרוכזות בלוח השנה
            </Typography>
          </Box>
        </Stack>
        <CreateTagButton
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedTag(null);
            setIsCreateOpen(true);
          }}
          sx={{
            background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
          }}
        >
          תג ייצור חדש
        </CreateTagButton>
      </TagsHeader>

      {/* Main Content */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : tags.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)' }}>
          <CalendarMonthIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            אין עדיין תגי ייצור רשומים במערכת
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            צור תג ייצור ראשון כדי לקבל דוח מרוכז של כל המוצרים וחומרי הגלם שהכנת בטווח תאריכים מסוים.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedTag(null);
              setIsCreateOpen(true);
            }}
            sx={{ borderRadius: 2 }}
          >
            צור תג ראשון
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tags.map((tag) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tag.id}>
              <TagCard onClick={() => handleOpenSummary(tag)} variant="outlined" sx={{ cursor: 'pointer' }}>
                <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" fontWeight={800} color="text.primary" noWrap sx={{ maxWidth: '80%' }}>
                      {tag.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenEdit(tag, e)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="primary.main" fontWeight={700} sx={{ mb: 1.5 }}>
                    {formatDateRange(tag)}
                  </Typography>
                  {tag.description && (
                    <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.5
                    }}>
                      {tag.description}
                    </Typography>
                  )}
                </CardContent>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    הצג סיכום וכמויות
                  </Button>
                </Box>
              </TagCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialogs */}
      <CreateTagDialog
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setSelectedTag(null);
        }}
        onSave={loadTags}
        subscriptionId={subscriptionId}
        tagToEdit={selectedTag}
      />

      <TagSummaryDialog
        open={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          setSelectedTag(null);
        }}
        tagId={selectedTag ? selectedTag.id : null}
        onEditClick={() => {
          setIsSummaryOpen(false);
          setIsCreateOpen(true);
        }}
      />
    </TagsContainer>
  );
};

export default TagsPage;
