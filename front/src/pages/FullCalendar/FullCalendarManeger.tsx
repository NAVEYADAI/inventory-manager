import { Tooltip } from "@mui/material";
import {
  CalendarContainer,
  CalendarCard,
  AddTagFab
} from "./FullCalendarManeger.style";
import PageHeader from "../../components/PageHeader/PageHeader";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useRef } from "react";
import CustomCalendarToolbar from "../../components/CalendarDisplay/CustomCalendarToolbar";
import { useCalendarEvents } from "./hooks/useCalendarEvents";
import { useCalendarViewState } from "./hooks/useCalendarViewState";
import { useCalendarDialogs } from "./hooks/useCalendarDialogs";
import { CalendarDayHeaderCell } from "./components/CalendarDayHeaderCell";
import { CalendarDayGridCell } from "./components/CalendarDayGridCell";
import { CalendarDialogsManager } from "./components/CalendarDialogsManager";

const FullCalendarManeger = () => {
  const calendarRef = useRef<any>(null);

  // Unified Hooks
  const { viewState, updateFromDatesSet, setDateSelection, setCurrentView } = useCalendarViewState();
  const dialogs = useCalendarDialogs();

  // Toolbar Handlers
  const handlePrev = () => calendarRef.current?.getApi().prev();
  const handleNext = () => calendarRef.current?.getApi().next();
  const handleToday = () => calendarRef.current?.getApi().today();
  const handleViewChange = (viewName: string) => {
    calendarRef.current?.getApi().changeView(viewName);
    setCurrentView(viewName);
  };
  const handleDateSelect = (year: number, month: number) => {
    setDateSelection(year, month);
    calendarRef.current?.getApi().gotoDate(new Date(year, month, 1));
  };

  const handleDatesSet = (dateInfo: any) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      updateFromDatesSet(calendarApi.getDate(), calendarApi.view.type, dateInfo?.view?.title);
    }
  };

  // Event & Date Click Handlers
  const handleEventClick = (info: any) => {
    if (info.event.extendedProps.isRecipeExecution) {
      dialogs.openExecutionDetail(info.event.extendedProps.execution);
    } else if (info.event.extendedProps.isTag) {
      dialogs.openTagSummary(info.event.extendedProps.tag);
    } else if (info.event.extendedProps.isHoliday) {
      const holidayName = info.event.extendedProps.holidayName;
      const holidayDate = info.event.extendedProps.holidayDate;

      // Calculate 1 month (30 days) before holiday
      const hDate = new Date(holidayDate);
      const sDate = new Date(hDate);
      sDate.setDate(hDate.getDate() - 30);

      dialogs.openCreateTag({
        name: holidayName,
        startDate: sDate.toISOString().substring(0, 10),
        endDate: holidayDate,
      });
    }
  };

  // Retrieve subscriptionId
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
    dialogs.openProductLog(arg.dateStr);
  };

  return (
    <CalendarContainer dir="rtl">
      <PageHeader
        title="לוח שנה ומועדים"
        subtitle="ניהול אירועים עסקיים לצד תאריכים עבריים וחגי ישראל"
        colorTheme="secondary"
        icon={<CalendarMonthIcon />}
      />

      {/* Main Calendar Card */}
      <CalendarCard>
        <CustomCalendarToolbar
          selectedMonth={viewState.month}
          selectedYear={viewState.year}
          currentView={viewState.currentView}
          viewTitle={viewState.title}
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
          allDayText="כל היום"
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
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
          dayHeaderContent={(arg) => <CalendarDayHeaderCell arg={arg} />}
          dayCellContent={(arg) => <CalendarDayGridCell arg={arg} />}
        />
      </CalendarCard>

      <CalendarDialogsManager
        subscriptionId={subscriptionId}
        dialogs={dialogs}
        onSaveExecutions={loadExecutions}
        onSaveTags={loadTags}
      />

      <Tooltip title="יצירת תקופת ייצור (תג) חדשה" placement="top" arrow>
        <AddTagFab
          color="secondary"
          aria-label="add-tag"
          onClick={() => dialogs.openCreateTag(null)}
        >
          <LocalOfferIcon />
        </AddTagFab>
      </Tooltip>
    </CalendarContainer>
  );
};

export default FullCalendarManeger;
