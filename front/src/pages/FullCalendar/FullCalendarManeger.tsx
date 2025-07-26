import { Box } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
const FullCalendarManeger = () => {
  const [events, setEvents] = useState([
    { title: "פגישה עם דני", date: "2025-07-14" },
    { title: "הרצאה", date: "2025-07-16" },
  ]);
  const handleDateClick = (arg: any) => {
    alert(`תאריך נבחר: ${arg.dateStr}`);
  };
  return (
    <Box sx={{ width: " 1000px", height: "900px" }}>
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
        dateClick={handleDateClick}
        events={events}
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
      />

      <h2>dfrdfd</h2>
    </Box>
  );
};

export default FullCalendarManeger;
