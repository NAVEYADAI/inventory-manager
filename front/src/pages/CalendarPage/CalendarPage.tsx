import { Box } from '@mui/material';
import CalendarDisplay from '../../components/CalendarDisplay/CalendarDisplay';

const CalendarPage = () => {
  return (
    <Box p={3}>
      <h2>לוח שנה עברי</h2>
      <CalendarDisplay />
    </Box>
  );
};

export default CalendarPage;
