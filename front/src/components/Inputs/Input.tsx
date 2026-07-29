import React from 'react';
import TextInput, { type TextInputProps } from './TextInput';
import SelectInput, { type SelectInputProps } from './SelectInput';
import AutocompleteInput, { type AutocompleteInputProps } from './AutocompleteInput';

// Base props shared by all inputs
export interface BaseInputProps extends Omit<TextInputProps, 'type' | 'onChange'> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Props for text-based inputs (text, password, date, multiline, etc.)
export type TextInputPropsType = BaseInputProps & {
  type?: 'text' | 'textInput' | 'password' | 'date' | 'number' | 'email' | 'tel' | 'url' | 'multiline';
};

// Props for searchable Autocomplete inputs
export type AutocompleteInputPropsType = Omit<AutocompleteInputProps, 'type'> & {
  type: 'autocomplete' | 'autocompleteInput';
};

// Props for standard Select dropdown inputs
export type SelectInputPropsType = Omit<SelectInputProps, 'type'> & {
  type: 'select' | 'selectInput';
};

export type InputProps = TextInputPropsType | AutocompleteInputPropsType | SelectInputPropsType;

const Input = (props: InputProps) => {
  const { type = 'text' } = props;

  switch (type) {
    case 'autocomplete':
    case 'autocompleteInput': {
      const { type: _, ...autocompleteProps } = props as AutocompleteInputPropsType;
      return <AutocompleteInput {...autocompleteProps} />;
    }

    case 'select':
    case 'selectInput': {
      const { type: _, ...selectProps } = props as SelectInputPropsType;
      return <SelectInput {...selectProps} />;
    }

    case 'text':
    case 'textInput':
    default: {
      const {
        state,
        setState,
        value,
        onChange,
        type: textType,
        ...rest
      } = props as TextInputPropsType;

      const isMultiline = textType === 'multiline';
      const actualType = (textType === 'textInput' || textType === 'multiline') ? undefined : textType;

      return (
        <TextInput
          state={state}
          setState={setState}
          value={value}
          onChange={onChange}
          type={actualType}
          multiline={isMultiline ? true : undefined}
          {...rest}
        />
      );
    }
  }
};

export default Input;
export { TextInput, SelectInput, AutocompleteInput };

