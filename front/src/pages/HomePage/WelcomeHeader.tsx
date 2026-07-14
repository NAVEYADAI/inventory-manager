import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { CompactWelcome } from './HomePage.style';
import { UI_STRINGS } from '../../constants/uiStrings';

interface WelcomeHeaderProps {
  userName: string;
  currentCompany: {
    name: string;
    subscriptionId?: number;
  } | null;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, currentCompany }) => {
  return (
    <CompactWelcome>
      <Box display="flex" alignItems="center" gap={1.5}>
        <DashboardIcon sx={{ color: "#ffffff" }} />
        <Typography variant="h5" fontWeight={800} color="#ffffff">
          שלום, {userName || "אורח"}!
        </Typography>
      </Box>
      {currentCompany && (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={600} sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
            {UI_STRINGS.home.activeCompanyPrefix}
          </Typography>

          <Chip
            label={currentCompany.name}
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 700,
              borderColor: "rgba(255, 255, 255, 0.4)",
              color: "#ffffff",
              bgcolor: "rgba(255, 255, 255, 0.08)",
            }}
          />
        </Box>
      )}
    </CompactWelcome>
  );
};

export default WelcomeHeader;
