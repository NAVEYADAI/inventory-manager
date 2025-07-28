import { Route, Routes } from "react-router-dom";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import HomePage from "../pages/HomePage/HomePage";
import FullCalendarManeger from "../pages/FullCalendar/FullCalendarManeger";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/calendar2" element={<FullCalendarManeger />} />
    </Routes>
  );
};
