import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface YieldTypeSelectorProps {
  value: 'WEIGHT' | 'UNITS';
  onChange: (value: 'WEIGHT' | 'UNITS') => void;
}

const YieldTypeSelector: React.FC<YieldTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <FormControl sx={{ minWidth: 220, flex: 1 }}>
      <InputLabel id="yield-type-select-label">סוג תוצר המתכון</InputLabel>
      <Select
        labelId="yield-type-select-label"
        value={value}
        label="סוג תוצר המתכון"
        onChange={(e) => onChange(e.target.value as 'WEIGHT' | 'UNITS')}
      >
        <MenuItem value="WEIGHT">משקל (כמות משקל שקולה נטו)</MenuItem>
        <MenuItem value="UNITS">יחידות (כמות יחידות ספורה)</MenuItem>
      </Select>
    </FormControl>
  );
};

export default YieldTypeSelector;
