import { Route, Routes } from 'react-router-dom';
import CalendarPage from '../pages/CalendarPage/CalendarPage';
import HomePage from '../pages/HomePage/HomePage';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  );
};
