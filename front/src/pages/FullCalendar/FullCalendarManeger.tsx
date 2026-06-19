import { Box, Typography, Paper, Stack } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState, useEffect, useCallback } from "react";
import { useHolidays } from "../../hooks/useHolidays";
import CreateProductLogDialog from "../../dialogs/createProductLogDialog/CreateProductLogDialog";
import RecipeExecutionDetailDialog from "../../dialogs/recipeExecutionDetailDialog/RecipeExecutionDetailDialog";
import { getProductExecutions } from "../../api/createProduct";

const gematriaDay = (dayNum: number): string => {
  const map: Record<number, string> = {
    1: "א׳", 2: "ב׳", 3: "ג׳", 4: "ד׳", 5: "ה׳", 6: "ו׳", 7: "ז׳", 8: "ח׳", 9: "ט׳",
    10: "י׳", 11: "יא׳", 12: "יב׳", 13: "יג׳", 14: "יד׳", 15: "טו׳", 16: "טז׳", 17: "יז׳", 18: "יח׳", 19: "יט׳",
    20: "כ׳", 21: "כא׳", 22: "כב׳", 23: "כג׳", 24: "כד׳", 25: "כה׳", 26: "כו׳", 27: "כז׳", 28: "כח׳", 29: "כט׳",
    30: "ל׳"
  };
  return map[dayNum] || String(dayNum);
};

const FullCalendarManeger = () => {
  const holidays = useHolidays();
  const [executions, setExecutions] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState('');
  const [selectedExecution, setSelectedExecution] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleEventClick = (info: any) => {
    if (info.event.extendedProps.isRecipeExecution) {
      setSelectedExecution(info.event.extendedProps.execution);
      setIsDetailOpen(true);
    }
  };

  // Retrieve current subscriptionId
  const userStr = localStorage.getItem("user");
  let subscriptionId: number | undefined = undefined;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      subscriptionId = user.selectedCompany?.subscriptionId;
    } catch { }
  }

  const loadExecutions = useCallback(async () => {
    if (!subscriptionId) return;
    try {
      const data = await getProductExecutions(subscriptionId);
      setExecutions(data);
    } catch (e) {
      console.error("Failed to load product executions", e);
    }
  }, [subscriptionId]);

  useEffect(() => {
    loadExecutions();
  }, [loadExecutions]);

  const handleDateClick = (arg: any) => {
    setClickedDate(arg.dateStr);
    setIsDialogOpen(true);
  };

  // Format Hebrew date text. Reduces clutter by showing full month name only on 1st of month.
  const getHebrewDateText = (date: Date) => {
    try {
      const formatter = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
        day: 'numeric',
        month: 'long',
      });
      const parts = formatter.formatToParts(date);
      const dayPart = parts.find(p => p.type === 'day')?.value;
      const monthPart = parts.find(p => p.type === 'month')?.value;

      if (dayPart && monthPart) {
        const dayNum = parseInt(dayPart, 10);
        if (dayNum === 1) {
          return `${gematriaDay(dayNum)} ${monthPart}`;
        }
        return gematriaDay(dayNum);
      }
      return formatter.format(date);
    } catch (e) {
      return '';
    }
  };

  console.log(holidays);

  // Categorize holidays based primarily on Hebcal's subcat field
  const getEventStyle = (h: any) => {
    const subcat = h.subcat || '';
    const title = (h.title || '').toLowerCase();
    const hebrew = h.hebrew || '';

    // 1. Fasts (צומות ותעניות)
    if (subcat === 'fast') {
      return {
        color: '#b45309', // Warm Amber (צום)
        textColor: '#ffffff',
      };
    }

    // 2. Memorial Days (ימי זיכרון ושואה)
    // Note: Yom HaAtzma'ut and Yom Yerushalayim are also 'modern' subcat, so we filter by keywords
    if (
      subcat === 'modern' &&
      (title.includes('zikaron') || title.includes('shoah') || hebrew.includes('זיכרון') || hebrew.includes('שואה'))
    ) {
      return {
        color: '#475569', // Slate Grey (ימי זיכרון ושואה)
        textColor: '#ffffff',
      };
    }

    // 3. Happy Holidays (חגים מועדים ושמחות - major, minor, modern celebrations)
    return {
      color: '#e11d48', // Premium Rose
      textColor: '#ffffff',
    };
  };

  // Merge custom events with holidays fetched from Hebcal API
  const allEvents = [
    ...holidays.map((h: any) => {
      const style = getEventStyle(h);
      return {
        title: h.hebrew || h.title,
        date: h.date,
        allDay: true,
        color: style.color,
        textColor: style.textColor,
        display: 'block',
      };
    }),
    ...executions.map((exec: any) => ({
      title: `הכנה: ${exec.recipe?.name || 'מתכון לא ידוע'} (כפול ${exec.batche_count})`,
      start: exec.created_time,
      allDay: false,
      color: '#059669', // Modern emerald green
      textColor: '#ffffff',
      display: 'block',
      extendedProps: {
        isRecipeExecution: true,
        execution: exec
      }
    })),
  ];

  return (
    <Box p={4} dir="rtl" sx={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Premium Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #673ab7 100%)', // Rich indigo/blue/violet brand gradient
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.15)'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <CalendarMonthIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight={800}>לוח שנה ומועדים</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              ניהול אירועים עסקיים לצד תאריכים עבריים וחגי ישראל
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Main Calendar Card */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: 'background.paper',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
          border: '1px solid #e2e8f0',
          // Custom CSS Overrides for FullCalendar
          '& .fc': {
            fontFamily: '"Outfit", "Rubik", "Inter", sans-serif',
            color: '#1e293b',
          },
          '& .fc-header-toolbar': {
            marginBottom: '24px !important',
            padding: '4px',
            flexWrap: 'wrap',
            gap: '12px',
          },
          '& .fc-toolbar-title': {
            fontSize: '1.5rem !important',
            fontWeight: '800 !important',
            color: '#0f172a',
          },
          '& .fc-button': {
            backgroundColor: '#ffffff !important',
            border: '1px solid #e2e8f0 !important',
            color: '#475569 !important',
            fontWeight: '600 !important',
            fontSize: '0.875rem !important',
            padding: '8px 16px !important',
            borderRadius: '10px !important',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05) !important',
            transition: 'all 0.2s ease-in-out !important',
            textTransform: 'none !important',
          },
          '& .fc-button:hover': {
            backgroundColor: '#f8fafc !important',
            borderColor: '#cbd5e1 !important',
            color: '#0f172a !important',
            transform: 'translateY(-1px)',
          },
          '& .fc-button-primary:not(:disabled).fc-button-active, & .fc-button-primary:not(:disabled):active': {
            backgroundColor: '#f1f5f9 !important',
            borderColor: '#cbd5e1 !important',
            color: '#0f172a !important',
            fontWeight: '700 !important',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02) !important',
          },
          '& .fc-today-button': {
            backgroundColor: '#eff6ff !important',
            borderColor: '#bfdbfe !important',
            color: '#2563eb !important',
          },
          '& .fc-today-button:hover': {
            backgroundColor: '#dbeafe !important',
            borderColor: '#93c5fd !important',
          },
          '& .fc-theme-standard td, & .fc-theme-standard th': {
            borderColor: '#f1f5f9 !important', // Soft grid lines
          },
          '& .fc-scrollgrid': {
            border: '1px solid #e2e8f0 !important',
            borderRadius: '16px',
            overflow: 'hidden',
          },
          '& .fc-col-header': {
            backgroundColor: '#f8fafc',
          },
          '& .fc-col-header-cell-cushion': {
            padding: '12px 4px !important',
            color: '#475569 !important',
            fontWeight: '700 !important',
            fontSize: '0.9rem !important',
            textDecoration: 'none !important',
          },
          '& .fc-daygrid-day': {
            transition: 'background-color 0.2s ease !important',
          },
          '& .fc-daygrid-day:hover': {
            backgroundColor: '#f8fafc !important',
          },
          '& .fc-day-today': {
            backgroundColor: '#f0fdf4 !important', // Soft light green for today
          },
          // Soften and reset the default day-number styles so our React components can render centered
          '& .fc-daygrid-day-number': {
            padding: '4px !important',
            textDecoration: 'none !important',
            color: 'inherit !important',
            display: 'block !important',
            width: '100%',
          },
          '& .fc-event': {
            borderRadius: '6px !important',
            padding: '4px 8px !important',
            margin: '2px 4px !important',
            fontSize: '0.78rem !important',
            fontWeight: '600 !important',
            border: 'none !important',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05) !important',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease !important',
          },
          '& .fc-event:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1) !important',
            cursor: 'pointer',
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          fixedWeekCount={false}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          direction="rtl"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={allEvents}
          locale="he"
          buttonText={{
            today: "היום",
            month: "חודש",
            week: "שבוע",
            day: "יום",
          }}
          views={{
            customThreeDay: {
              type: 'timeGrid',
              duration: { days: 3 },
              buttonText: '3 ימים'
            }
          }}
          // Render Hebrew dates alongside the day number in each calendar cell
          dayCellContent={(arg) => {
            const hebrewDate = getHebrewDateText(arg.date);
            const isFirst = hebrewDate.includes("א׳");
            const isToday = arg.isToday;

            return (
              <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%" gap={0.5} sx={{ pr: 1.5, pt: 0.5 }}>
                <Box
                  sx={isToday ? {
                    backgroundColor: '#10b981', // Today highlight circle (green)
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)',
                  } : {
                    color: '#1e293b',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {arg.dayNumberText}
                </Box>
                {hebrewDate && (
                  <Typography
                    variant="caption"
                    color={isFirst ? "secondary.main" : "text.secondary"}
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: isFirst ? '700' : '500',
                      mt: 0.1,
                      pr: 0.25
                    }}
                  >
                    {hebrewDate}
                  </Typography>
                )}
              </Box>
            );
          }}
        />
      </Paper>

      <CreateProductLogDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        dateStr={clickedDate}
        subscriptionId={subscriptionId}
        onSave={loadExecutions}
      />

      <RecipeExecutionDetailDialog
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedExecution(null);
        }}
        execution={selectedExecution}
        onDelete={loadExecutions}
      />
    </Box>
  );
};

export default FullCalendarManeger;
