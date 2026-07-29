import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { type TextInputProps } from './TextInput';

export interface SelectInputOption {
  label: string;
  value: any;
}

export type SelectInputProps = Omit<TextInputProps, 'onChange'> & {
  options: SelectInputOption[];
  onChange?: (value: any) => void;
};

const SelectInput = ({
  state,
  setState,
  value,
  onChange,
  options,
  ...rest
}: SelectInputProps) => {
  const val = state !== undefined ? state : value;

  return (
    <FormControl size={rest.size} fullWidth={rest.fullWidth} disabled={rest.disabled} error={rest.error}>
      {rest.label && <InputLabel id={`${rest.id || 'select'}-label`}>{rest.label}</InputLabel>}
      <Select
        labelId={rest.label ? `${rest.id || 'select'}-label` : undefined}
        id={rest.id}
        value={val ?? ''}
        label={rest.label}
        onChange={(e: SelectChangeEvent<any>) => {
          const rawValue = e.target.value;
          if (setState) {
            setState(rawValue);
          }
          if (onChange) {
            onChange(rawValue);
          }
        }}
        sx={{
          borderRadius: rest.size === 'small' ? '12px' : '16px',
          bgcolor: '#f8fafc',
          '& .MuiSelect-select': { pr: 4, pl: 2, textAlign: 'right' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
