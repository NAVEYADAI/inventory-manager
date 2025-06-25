import { useContext } from 'react';
import { CalendarContext } from './CalendarProvider';
import type { CalendarContextType } from './types';

export const useCalendar = (): CalendarContextType => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
};
