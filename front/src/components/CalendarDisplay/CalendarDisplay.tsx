import { Box, Typography } from '@mui/material';
import { useCalendar } from '../../providers/calendar/useCalendar';
import CalendarItem from './CalendarItem';

const CalendarDisplay = () => {
  const { dates } = useCalendar();

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        לוח שנה עברי
      </Typography>
      {dates.map((date, i) => (
        <CalendarItem key={i} date={date} />
      ))}
    </Box>
  );
};

export default CalendarDisplay;
