import { useState, useCallback } from "react";

export const useCalendarViewState = () => {
  const [viewState, setViewState] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    currentView: "dayGridMonth",
    title: "",
  });

  const updateFromDatesSet = useCallback((currentDate: Date, viewType: string, viewTitle?: string) => {
    setViewState({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      currentView: viewType,
      title: viewTitle || "",
    });
  }, []);

  const setDateSelection = useCallback((year: number, month: number) => {
    setViewState((prev) => ({
      ...prev,
      year,
      month,
    }));
  }, []);

  const setCurrentView = useCallback((currentView: string) => {
    setViewState((prev) => ({
      ...prev,
      currentView,
    }));
  }, []);

  return {
    viewState,
    updateFromDatesSet,
    setDateSelection,
    setCurrentView,
  };
};
