export interface HebrewDate {
    gregorian: string;
    hebrew: string;
    holiday?: string;
  }
  
  export interface CalendarContextType {
    dates: HebrewDate[];
    refreshDates: () => void;
  }
  