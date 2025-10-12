import { Navigate, Route, Routes } from "react-router-dom";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import HomePage from "../pages/HomePage/HomePage";
import FullCalendarManeger from "../pages/FullCalendar/FullCalendarManeger";
import LoginAndSignin from "../pages/LoginAndSignin/LoginAndSignin";

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginAndSignin />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/calendar2" element={<FullCalendarManeger />} />
    </Routes>
  );
};
