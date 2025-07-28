import { CalendarProvider } from './calendar/CalendarProvider';

export const MainProvider = ({ children }: { children: any }) => {
  return <CalendarProvider>{children}</CalendarProvider>;
};
