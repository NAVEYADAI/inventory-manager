import React from 'react';
import { Autocomplete, type AutocompleteProps } from '@mui/material';
import TextInput, { type TextInputProps } from './TextInput';

export type AutocompleteInputOption = string | { label: string; value: any };

export type AutocompleteInputProps = Omit<TextInputProps, 'onChange'> & {
  options: AutocompleteInputOption[];
  onChange?: (value: any) => void;
  autocompleteProps?: Partial<AutocompleteProps<AutocompleteInputOption, false, false, boolean>>;
};

const AutocompleteInput = ({
  state,
  setState,
  value,
  onChange,
  options,
  autocompleteProps,
  ...rest
}: AutocompleteInputProps) => {
  const val = state !== undefined ? state : value;

  const getAutocompleteValue = () => {
    if (val === undefined || val === null || val === '') return null;
    const found = options.find((opt) => {
      if (typeof opt === 'string') {
        return opt === val;
      }
      return opt.value === val;
    });
    return found || null;
  };

  return (
    <Autocomplete<AutocompleteInputOption, false, false, boolean>
      options={options}
      value={getAutocompleteValue()}
      onChange={(_event, newValue) => {
        const rawValue = newValue
          ? typeof newValue === 'string'
            ? newValue
            : newValue.value
          : '';
        if (setState) {
          setState(rawValue);
        }
        if (onChange) {
          onChange(rawValue);
        }
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return option.label;
      }}
      isOptionEqualToValue={(option, valueVal) => {
        const optVal = typeof option === 'string' ? option : option.value;
        const cmpVal = typeof valueVal === 'string' ? valueVal : valueVal?.value;
        return optVal === cmpVal;
      }}
      sx={{
        '& .MuiAutocomplete-endAdornment': { right: 'auto', left: 9 }, // Mirror end placement for RTL
        '& .MuiOutlinedInput-root': {
          borderRadius: rest.size === 'small' ? '12px' : '16px',
          backgroundColor: '#f8fafc',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
        },
      }}
      renderInput={(params) => (
        <TextInput
          {...params}
          {...rest}
          state={undefined}
          setState={undefined}
          onChange={undefined}
        />
      )}
      {...autocompleteProps}
    />
  );
};

export default AutocompleteInput;
