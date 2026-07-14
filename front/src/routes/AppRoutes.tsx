import { Navigate, Route, Routes } from "react-router-dom";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import HomePage from "../pages/HomePage/HomePage";
import FullCalendarManeger from "../pages/FullCalendar/FullCalendarManeger";
import LoginAndSignin from "../pages/LoginAndSignin/LoginAndSignin";
import CompanySetup from "../pages/CompanySetup/CompanySetup";
import CompanyPicker from "../pages/CompanyPicker/CompanyPicker";
import RecipesPage from "../pages/RecipesPage/RecipesPage";
import TagsPage from "../pages/TagsPage/TagsPage";
import EmployeesPage from "../pages/EmployeesPage/EmployeesPage";
import PendingPreparationsPage from "../pages/PendingPreparationsPage/PendingPreparationsPage";
import ActivityLogPage from "../pages/ActivityLogPage/ActivityLogPage";
import { useAuth } from "../providers/AuthProvider";
import { AppRoutes } from "./routes.enum";

export const Router = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path={AppRoutes.LOGIN} element={<LoginAndSignin />} />
        <Route path="*" element={<Navigate to={AppRoutes.LOGIN} replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path={AppRoutes.LOGIN} element={<LoginAndSignin />} />
      <Route path={AppRoutes.HOME} element={<HomePage />} />
      <Route path={AppRoutes.COMPANY_SETUP} element={<CompanySetup />} />
      <Route path={AppRoutes.COMPANY_PICKER} element={<CompanyPicker />} />
      <Route path={AppRoutes.CALENDAR} element={<CalendarPage />} />
      <Route path={AppRoutes.CALENDAR2} element={<FullCalendarManeger />} />
      <Route path={AppRoutes.RECIPES} element={<RecipesPage />} />
      <Route path={AppRoutes.TAGS} element={<TagsPage />} />
      <Route path={AppRoutes.EMPLOYEES} element={<EmployeesPage />} />
      <Route path={AppRoutes.PENDING_PREPARATIONS} element={<PendingPreparationsPage />} />
      <Route path={AppRoutes.ACTIVITY_LOG} element={<ActivityLogPage />} />
      <Route path="*" element={<Navigate to={AppRoutes.HOME} replace />} />
    </Routes>
  );
};

