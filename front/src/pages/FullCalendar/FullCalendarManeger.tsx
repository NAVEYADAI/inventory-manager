import { Box, Typography } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { useHolidays } from "../../hooks/useHolidays";

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
  const [customEvents] = useState([
    { title: "פגישה עם דני", date: "2026-03-02" },
    { title: "הרצאה", date: "2026-03-16" },
  ]);

  const handleDateClick = (arg: any) => {
    alert(`תאריך נבחר: ${arg.dateStr}`);
  };

  // Format Hebrew date text using browser's built-in Intl API and Gematria converter
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
        return `${gematriaDay(dayNum)} ${monthPart}`;
      }
      return formatter.format(date);
    } catch (e) {
      return '';
    }
  };

  // Merge custom events with holidays fetched from Hebcal API
  const allEvents = [
    ...customEvents,
    ...holidays.map((h: any) => ({
      title: h.hebrew || h.title,
      date: h.date,
      allDay: true,
      color: '#9c27b0', // Beautiful purple color for Jewish holidays
      display: 'block',
    })),
  ];

  return (
    <Box sx={{ width: "100%", height: "900px", p: 2 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        editable={true}
        selectable={true}
        direction="rtl"  
        dateClick={handleDateClick}
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
          return (
            <Box display="flex" flexDirection="column" alignItems="center" width="100%">
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {arg.dayNumberText}
              </Typography>
              {hebrewDate && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem', mt: 0.25 }}>
                  {hebrewDate}
                </Typography>
              )}
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default FullCalendarManeger;
