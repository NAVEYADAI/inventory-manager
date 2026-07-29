import React from 'react';
import type { DayHeaderContentArg } from '@fullcalendar/core';
import { getHebrewDateText } from '../../../utils/dateUtils';
import {
  MonthHeaderTitle,
  HeaderCellContainer,
  HeaderDayName,
  HeaderDayNumber,
  HeaderHebrewBadge,
} from '../FullCalendarManeger.style';

interface CalendarDayHeaderCellProps {
  arg: DayHeaderContentArg;
}

export const CalendarDayHeaderCell: React.FC<CalendarDayHeaderCellProps> = ({ arg }) => {
  if (arg.view.type === 'dayGridMonth') {
    return <MonthHeaderTitle variant="body2">{arg.text}</MonthHeaderTitle>;
  }

  const hebrewDate = getHebrewDateText(arg.date);
  const isToday = arg.isToday;
  const dayName = new Intl.DateTimeFormat('he-IL', { weekday: 'short' }).format(arg.date);
  const dayNum = arg.date.getDate();

  return (
    <HeaderCellContainer>
      <HeaderDayName variant="caption" isToday={isToday}>
        {dayName}
      </HeaderDayName>
      <HeaderDayNumber isToday={isToday}>{dayNum}</HeaderDayNumber>
      {hebrewDate && (
        <HeaderHebrewBadge variant="caption" isToday={isToday}>
          {hebrewDate}
        </HeaderHebrewBadge>
      )}
    </HeaderCellContainer>
  );
};
