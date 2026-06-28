import { Box, Typography, Stack, Fab, Tooltip } from "@mui/material";
import {
  CalendarContainer,
  CalendarHeader,
  CalendarCard
} from "./FullCalendarManeger.style";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useState, useRef } from "react";
import CreateProductLogDialog from "../../dialogs/createProductLogDialog/CreateProductLogDialog";
import RecipeExecutionDetailDialog from "../../dialogs/recipeExecutionDetailDialog/RecipeExecutionDetailDialog";
import CustomCalendarToolbar from "../../components/CalendarDisplay/CustomCalendarToolbar";
import { getHebrewDateText } from "../../utils/dateUtils";
import type { TagDto } from "../../api/tag";
import CreateTagDialog from "../../dialogs/createTagDialog/CreateTagDialog";
import TagSummaryDialog from "../../dialogs/tagSummaryDialog/TagSummaryDialog";
import { useCalendarEvents } from "./hooks/useCalendarEvents";

const FullCalendarManeger = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState('');
  const [selectedExecution, setSelectedExecution] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedTag, setSelectedTag] = useState<TagDto | null>(null);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isTagSummaryOpen, setIsTagSummaryOpen] = useState(false);
  const [prefilledTag, setPrefilledTag] = useState<{ name: string; startDate: string; endDate: string } | null>(null);

  const calendarRef = useRef<any>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const handlePrev = () => calendarRef.current?.getApi().prev();
  const handleNext = () => calendarRef.current?.getApi().next();
  const handleToday = () => calendarRef.current?.getApi().today();
  const handleViewChange = (viewName: string) => {
    calendarRef.current?.getApi().changeView(viewName);
    setCurrentView(viewName);
  };
  const handleDateSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    calendarRef.current?.getApi().gotoDate(new Date(year, month, 1));
  };

  const handleDatesSet = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      setSelectedYear(currentDate.getFullYear());
      setSelectedMonth(currentDate.getMonth());
      setCurrentView(calendarApi.view.type);
    }
  };

  const handleEventClick = (info: any) => {
    if (info.event.extendedProps.isRecipeExecution) {
      setSelectedExecution(info.event.extendedProps.execution);
      setIsDetailOpen(true);
    } else if (info.event.extendedProps.isTag) {
      setSelectedTag(info.event.extendedProps.tag);
      setIsTagSummaryOpen(true);
    } else if (info.event.extendedProps.isHoliday) {
      const holidayName = info.event.extendedProps.holidayName;
      const holidayDate = info.event.extendedProps.holidayDate;

      // Calculate 1 month (30 days) before the holiday
      const hDate = new Date(holidayDate);
      const sDate = new Date(hDate);
      sDate.setDate(hDate.getDate() - 30);

      setPrefilledTag({
        name: holidayName,
        startDate: sDate.toISOString().substring(0, 10),
        endDate: holidayDate,
      });
      setSelectedTag(null);
      setIsTagDialogOpen(true);
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

  const { allEvents, refreshExecutions: loadExecutions, refreshTags: loadTags } = useCalendarEvents(subscriptionId);

  const handleDateClick = (arg: any) => {
    setClickedDate(arg.dateStr);
    setIsDialogOpen(true);
  };

  return (
    <CalendarContainer dir="rtl">
      {/* Premium Header Card */}
      <CalendarHeader elevation={0}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ width: "100%", justifyContent: { xs: "center", sm: "flex-start" } }}>
          <CalendarMonthIcon sx={{ fontSize: 40 }} />
          <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
            <Typography variant="h4" fontWeight={800}>לוח שנה ומועדים</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              ניהול אירועים עסקיים לצד תאריכים עבריים וחגי ישראל
            </Typography>
          </Box>
        </Stack>
      </CalendarHeader>

      {/* Main Calendar Card */}
      <CalendarCard>
        <CustomCalendarToolbar
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          currentView={currentView}
          onToday={handleToday}
          onPrev={handlePrev}
          onNext={handleNext}
          onViewChange={handleViewChange}
          onDateSelect={handleDateSelect}
        />

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          fixedWeekCount={false}
          headerToolbar={false}
          datesSet={handleDatesSet}
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
                    backgroundColor: '#10b981',
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
      </CalendarCard>

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

      <CreateTagDialog
        open={isTagDialogOpen}
        onClose={() => {
          setIsTagDialogOpen(false);
          setSelectedTag(null);
          setPrefilledTag(null);
        }}
        onSave={loadTags}
        subscriptionId={subscriptionId}
        tagToEdit={selectedTag}
        prefilledData={prefilledTag}
      />

      <TagSummaryDialog
        open={isTagSummaryOpen}
        onClose={() => {
          setIsTagSummaryOpen(false);
          setSelectedTag(null);
        }}
        tagId={selectedTag ? selectedTag.id : null}
        onEditClick={() => {
          setIsTagSummaryOpen(false);
          setIsTagDialogOpen(true);
        }}
      />
      <Tooltip title="יצירת תקופת ייצור (תג) חדשה" placement="top" arrow>
        <Fab
          color="secondary"
          aria-label="add-tag"
          onClick={() => {
            setSelectedTag(null);
            setIsTagDialogOpen(true);
          }}
          sx={{
            position: "fixed",
            bottom: 32,
            left: 32,
            background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
            boxShadow: '0 4px 16px rgba(156, 39, 176, 0.4)',
            color: "#ffffff",
            transition: "all 0.2s ease-in-out",
            zIndex: 1000,
            '&:hover': {
              background: 'linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)',
              transform: 'scale(1.08)',
              boxShadow: '0 6px 20px rgba(156, 39, 176, 0.5)',
            }
          }}
        >
          <LocalOfferIcon />
        </Fab>
      </Tooltip>
    </CalendarContainer>
  );
};

export default FullCalendarManeger;
