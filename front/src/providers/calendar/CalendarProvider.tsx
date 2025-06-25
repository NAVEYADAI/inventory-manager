import { createContext, useEffect, useState  } from "react";
import type { HebrewDate, CalendarContextType } from "./types";

export const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider = ({ children }: { children: any }) => {
  const [dates, setDates] = useState<HebrewDate[]>([]);

  const fetchDates = async () => {
    const res = await fetch(
      "https://www.hebcal.com/hebcal?v=1&cfg=json&year=now&month=x&maj=on&min=on&mod=on&nx=on&s=on&ss=on&mf=on&c=on"
    );
    const data = await res.json();

    const parsed: HebrewDate[] = data.items
      .filter((item: any) => item.date && item.hebrew)
      .map((item: any) => ({
        gregorian: item.date,
        hebrew: item.hebrew,
        holiday: item.title.includes("חג") ? item.title : undefined,
      }));

    setDates(parsed);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  return (
    <CalendarContext.Provider value={{ dates, refreshDates: fetchDates }}>
      {children}
    </CalendarContext.Provider>
  );
};
