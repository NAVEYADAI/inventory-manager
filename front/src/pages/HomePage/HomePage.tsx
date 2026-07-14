import { useState } from 'react';
import { Grid } from '@mui/material';
import { HomeContainer } from './HomePage.style';
import CreateRawMaterialDialog from '../../dialogs/createRawMaterialDialog/CreateRawMaterialDialog';
import { createRawMaterials } from '../../api/rawMaterial';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import WelcomeHeader from './WelcomeHeader';
import DashboardTile from './DashboardTile';
import { AppRoutes } from '../../routes/routes.enum';
import { UI_STRINGS } from '../../constants/uiStrings';


const HomePage = () => {
  const [createRawMaterialOpen, setCreateRawMaterialOpen] = useState(false);
  const userStr = localStorage.getItem("user");
  let currentCompany = null;
  let userName = "";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      currentCompany = user.selectedCompany;
      userName = user.firstName || user.name || user.email || "";
    } catch { }
  }

  const isAdmin = currentCompany?.role === 'admin' || currentCompany?.role === 'owner';

  return (
    <HomeContainer dir="rtl">
      {/* Welcome Header Component */}
      <WelcomeHeader userName={userName} currentCompany={currentCompany} />

      {/* Tiles Grid */}
      <Grid container spacing={3} justifyContent="center">
        {/* Card 1: Recipes */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            to={AppRoutes.RECIPES}
            colorTheme="primary"
            icon={<MenuBookIcon sx={{ fontSize: 40, mb: 1.5 }} />}
            title={UI_STRINGS.home.recipesTitle}
            description="ניהול מתכונים, רכיבים והרצות ייצור"
          />
        </Grid>

        {/* Card 2: Calendar */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            to={AppRoutes.CALENDAR2}
            colorTheme="secondary"
            icon={<CalendarMonthIcon sx={{ fontSize: 40, mb: 1.5 }} />}
            title={UI_STRINGS.home.calendarTitle}
            description="מעקב הכנות ולוחות זמנים לייצור"
          />
        </Grid>

        {/* Card 3: Pending Preparations */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            to={AppRoutes.PENDING_PREPARATIONS}
            colorTheme="success"
            icon={<FactCheckIcon sx={{ fontSize: 40, mb: 1.5 }} />}
            title={UI_STRINGS.home.preparationsTitle}
            description="אישור תפוקת ייצור ועדכון חומרי גלם"
          />
        </Grid>

        {/* Card 4: Raw Materials */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            onClick={() => setCreateRawMaterialOpen(true)}
            colorTheme="info"
            icon={<LocalFloristIcon sx={{ fontSize: 40, mb: 1.5 }} />}
            title={UI_STRINGS.home.rawMaterialsTitle}
            description="הוספת חומרים והגדרת המרות יחידות"
          />
        </Grid>

        {/* Card 5: Production Reports */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            to={AppRoutes.TAGS}
            colorTheme="warning"
            icon={<AssessmentIcon sx={{ fontSize: 40, mb: 1.5 }} />}
            title={UI_STRINGS.home.reportsTitle}
            description="אצוות עבודה ושימושי חומרים במטבח"
          />
        </Grid>

        {/* Card 6: Activity Log */}
        {isAdmin && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DashboardTile
              to={AppRoutes.ACTIVITY_LOG}
              colorTheme="activity"
              icon={<HistoryIcon sx={{ fontSize: 40, mb: 1.5 }} />}
              title={UI_STRINGS.home.activityLogTitle}
              description="מעקב וביקורת אחר פעולות משתמשים"
            />
          </Grid>
        )}

        {/* Card 7: Employee Management */}
        {isAdmin && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DashboardTile
              to={AppRoutes.EMPLOYEES}
              colorTheme="employees"
              icon={<PeopleIcon sx={{ fontSize: 40, mb: 1.5 }} />}
              title={UI_STRINGS.home.employeesTitle}
              description="הוספת עובדים ועדכון תפקידים והרשאות"
            />
          </Grid>
        )}
      </Grid>

      {/* Dialog for adding raw materials */}
      <CreateRawMaterialDialog
        open={createRawMaterialOpen}
        onClose={() => setCreateRawMaterialOpen(false)}
        subscriptionId={currentCompany?.subscriptionId}
        onSave={async (rows) => {
          try {
            if (!currentCompany || !currentCompany.subscriptionId) {
              console.warn('No selected company / subscriptionId');
              return;
            }
            await createRawMaterials(currentCompany.subscriptionId, rows as any);
            console.log('Raw materials saved successfully');
          } catch (e) {
            console.error('Failed to save raw materials', e);
          }
        }}
      />
    </HomeContainer>
  );
};

export default HomePage;
