import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { HeaderBanner, type HeaderTheme } from './PageHeader.style';
import { AppRoutes } from '../../routes/routes.enum';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  colorTheme?: HeaderTheme;
  showBackButton?: boolean;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  colorTheme = 'primary',
  showBackButton = true,
  action,
}) => {
  const navigate = useNavigate();

  return (
    <HeaderBanner colorTheme={colorTheme} dir="rtl">
      <Box display="flex" alignItems="center" gap={2}>
        {showBackButton && (
          <IconButton
            onClick={() => navigate(AppRoutes.HOME)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            {icon && <Box display="flex" sx={{ opacity: 0.9, '& svg': { fontSize: '1.8rem' } }}>{icon}</Box>}
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5, fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {action && (
        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
          {action}
        </Box>
      )}
    </HeaderBanner>
  );
};

export default PageHeader;
