import React from 'react';
import type { DayCellContentArg } from '@fullcalendar/core';
import { getHebrewDateText } from '../../../utils/dateUtils';
import {
  CellContainer,
  CellDayNumber,
  CellHebrewText,
} from '../FullCalendarManeger.style';

interface CalendarDayGridCellProps {
  arg: DayCellContentArg;
}

export const CalendarDayGridCell: React.FC<CalendarDayGridCellProps> = ({ arg }) => {
  // Only render custom day cell content in month view.
  // In week/day (timeGrid) views, header content handles date numbers, and returning content here creates empty dots in the all-day row.
  if (arg.view.type !== 'dayGridMonth') {
    return null;
  }

  const hebrewDate = getHebrewDateText(arg.date);
  const isFirst = hebrewDate.includes('א׳');
  const isToday = arg.isToday;

  return (
    <CellContainer>
      <CellDayNumber isToday={isToday}>{arg.dayNumberText}</CellDayNumber>
      {hebrewDate && (
        <CellHebrewText variant="caption" isFirst={isFirst}>
          {hebrewDate}
        </CellHebrewText>
      )}
    </CellContainer>
  );
};
