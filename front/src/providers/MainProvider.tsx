import { AuthProvider } from './AuthProvider/AuthProvider';
import { CalendarProvider } from './calendar/CalendarProvider';

export const MainProvider = ({ children }: { children: any }) => {
  return <CalendarProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </CalendarProvider>;
};
