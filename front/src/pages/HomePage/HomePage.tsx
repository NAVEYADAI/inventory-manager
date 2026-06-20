import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, CardContent, Grid, Typography, Stack } from '@mui/material';
import {
  HomeContainer,
  WelcomeCard,
  CompanyBadge,
  ShortcutCard,
  ShortcutButton
} from './HomePage.style';
import CreateRawMaterialDialog from '../../dialogs/createRawMaterialDialog/CreateRawMaterialDialog';
import { createRawMaterials } from '../../api/rawMaterial';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import DashboardIcon from '@mui/icons-material/Dashboard';

const HomePage = () => {
  const [createRawMaterialOpen, setCreateRawMaterialOpen] = useState(false);
  const userStr = localStorage.getItem("user");
  let currentCompany = null;
  let userName = "";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      currentCompany = user.selectedCompany;
      userName = user.name || user.email || "";
    } catch { }
  }

  return (
    <HomeContainer dir="rtl">
      {/* Welcome Header Card */}
      <WelcomeCard elevation={0}>
        <Stack direction="row" spacing={3} alignItems="center">
          <DashboardIcon sx={{ fontSize: 50, opacity: 0.95 }} />
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              שלום, {userName || "אורח"}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: "1.1rem" }}>
              ברוך הבא למערכת ניהול המלאי החכמה של העסק שלך.
            </Typography>
            {currentCompany && (
              <CompanyBadge>
                <Typography variant="subtitle2" fontWeight={700}>
                  חברה פעילה כעת: {currentCompany.name}
                </Typography>
              </CompanyBadge>
            )}
          </Box>
        </Stack>
      </WelcomeCard>

      {/* Dashboard Section */}
      <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ mb: 3 }}>
        קיצורי דרך מהירים
      </Typography>

      <Grid container spacing={4}>
        {/* Card 1: Recipes */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ShortcutCard variant="outlined">
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <MenuBookIcon color="primary" sx={{ fontSize: 35 }} />
                <Typography variant="h6" fontWeight={800} color="text.primary">
                  ספר המתכונים
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, flexGrow: 1 }}>
                ניהול כל מתכוני העסק, רכיבים, יחידות מידה וכמויות. רישום הכנת מתכונים בפועל לעדכון המלאי.
              </Typography>
              <ShortcutButton
                component={Link}
                to="/recipes"
                variant="contained"
              >
                לספר המתכונים
              </ShortcutButton>
            </CardContent>
          </ShortcutCard>
        </Grid>

        {/* Card 2: Calendar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ShortcutCard variant="outlined">
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <CalendarMonthIcon color="primary" sx={{ fontSize: 35 }} />
                <Typography variant="h6" fontWeight={800} color="text.primary">
                  לוח שנה ואירועים
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, flexGrow: 1 }}>
                מעקב אחר ביצועי הכנת מתכונים, תזמון אירועים ולוח זמנים שבועי וחודשי לייצור מלאי.
              </Typography>
              <ShortcutButton
                component={Link}
                to="/calendar2"
                variant="contained"
                color="secondary"
              >
                למעבר ללוח
              </ShortcutButton>
            </CardContent>
          </ShortcutCard>
        </Grid>

        {/* Card 3: Raw Materials */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ShortcutCard variant="outlined">
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <LocalFloristIcon color="primary" sx={{ fontSize: 35 }} />
                <Typography variant="h6" fontWeight={800} color="text.primary">
                  חומרי גלם
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, flexGrow: 1 }}>
                הוספה ועדכון מהיר של חומרי גלם וסוגי מדידה לתוך המלאי של העסק שלך.
              </Typography>
              <ShortcutButton
                onClick={() => setCreateRawMaterialOpen(true)}
                variant="outlined"
              >
                הוספת חומרי גלם
              </ShortcutButton>
            </CardContent>
          </ShortcutCard>
        </Grid>
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
