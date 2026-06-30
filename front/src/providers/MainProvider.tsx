import { AuthProvider } from './AuthProvider/AuthProvider';
import { CalendarProvider } from './calendar/CalendarProvider';
import { NotificationProvider } from './NotificationProvider/NotificationProvider';

export const MainProvider = ({ children }: { children: any }) => {
  return <CalendarProvider>
    <NotificationProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NotificationProvider>
  </CalendarProvider>;
};
