import { Typography } from '@mui/material';
import { type HebrewDate } from '../../providers/calendar/types';

const CalendarItem = ({ date }: { date: HebrewDate }) => {
  return (
    <Typography>
      {date.gregorian} - {date.hebrew} {date.holiday && `(${date.holiday})`}
    </Typography>
  );
};

export default CalendarItem;
