import React from 'react';
import { Box, Typography, Switch } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import { SwitchContainerBox } from './IntermediateRecipeSwitch.style';

interface IntermediateRecipeSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const IntermediateRecipeSwitch: React.FC<IntermediateRecipeSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <SwitchContainerBox
      checked={checked}
    >
      <Box display="flex" alignItems="center" gap={2} sx={{ width: '85%' }}>
        <LayersIcon sx={{ color: checked ? 'secondary.main' : 'text.secondary', fontSize: 28, flexShrink: 0 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color={checked ? 'secondary.main' : 'text.primary'}>
            הפוך לתוצר ביניים (מתכון משנה)
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, lineHeight: 1.4 }}>
            הפעל אפשרות זו כדי שתוכל להשתמש במתכון זה כרכיב (חומר גלם) בתוך מתכונים אחרים במערכת.
          </Typography>
        </Box>
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        color="secondary"
      />
    </SwitchContainerBox>
  );
};

export default IntermediateRecipeSwitch;
