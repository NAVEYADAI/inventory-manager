import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { TileCard } from './HomePage.style';

interface DashboardTileProps {
  to?: string;
  onClick?: () => void;
  colorTheme: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DashboardTile: React.FC<DashboardTileProps> = ({
  to,
  onClick,
  colorTheme,
  icon,
  title,
  description,
}) => {
  const content = (
    <TileCard colorTheme={colorTheme}>
      {icon}
      <Typography variant="subtitle1" fontWeight={800} color="text.primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    </TileCard>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
        {content}
      </Link>
    );
  }

  return (
    <Box onClick={onClick} style={{ width: '100%' }}>
      {content}
    </Box>
  );
};

export default DashboardTile;
