import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input Component (Bridge)', () => {
  describe('Text Types (Fallback to TextInput)', () => {
    it('renders text input by default when type is not provided', () => {
      render(<Input label="שם משתמש" value="my-username" />);
      const textInput = screen.getByLabelText('שם משתמש');
      expect(textInput).toBeInTheDocument();
      expect(textInput).toHaveValue('my-username');
    });

    it('renders password type correctly', () => {
      render(<Input type="password" label="סיסמה" value="123456" />);
      const textInput = screen.getByLabelText('סיסמה');
      expect(textInput).toHaveAttribute('type', 'password');
    });

    it('triggers setState on text change', () => {
      const setState = vi.fn();
      render(<Input label="אימייל" state="" setState={setState} />);
      const textInput = screen.getByLabelText('אימייל');
      fireEvent.change(textInput, { target: { value: 'test@domain.com' } });
      expect(setState).toHaveBeenCalledWith('test@domain.com');
    });
  });

  describe('Select Dropdown Type', () => {
    const selectOptions = [
      { label: 'מנהל', value: 'admin' },
      { label: 'עובד', value: 'employee' },
    ];

    it('renders standard select options correctly', () => {
      render(
        <Input
          type="select"
          label="תפקיד"
          state="admin"
          options={selectOptions}
        />
      );
      // Under Material UI, the select triggers a clickable button with role button or combobox
      const selectButton = screen.getByLabelText('תפקיד');
      expect(selectButton).toBeInTheDocument();
      expect(selectButton).toHaveTextContent('מנהל');
    });

    it('calls setState when a select option is chosen', async () => {
      const setState = vi.fn();
      const { getByRole } = render(
        <Input
          type="select"
          label="תפקיד"
          state="admin"
          setState={setState}
          options={selectOptions}
        />
      );

      const selectButton = getByRole('combobox');
      fireEvent.mouseDown(selectButton); // Opens the dropdown list

      // Under MUI Select, the options appear inside a listbox popover
      const option = await screen.findByRole('option', { name: 'עובד' });
      fireEvent.click(option);

      expect(setState).toHaveBeenCalledWith('employee');
    });
  });

  describe('Autocomplete Searchable Dropdown Type', () => {
    const stringOptions = ['תל אביב', 'ירושלים', 'חיפה'];
    const objectOptions = [
      { label: 'ניהול עבודה', value: 'work_mgmt' },
      { label: 'ניהול עובדים', value: 'emp_mgmt' },
    ];

    it('renders autocomplete with string options and selects value', () => {
      render(
        <Input
          type="autocomplete"
          label="עיר מגורים"
          state="ירושלים"
          options={stringOptions}
        />
      );
      const autocompleteInput = screen.getByLabelText('עיר מגורים');
      expect(autocompleteInput).toBeInTheDocument();
      expect(autocompleteInput).toHaveValue('ירושלים');
    });

    it('calls setState with selected option for string options', async () => {
      const setState = vi.fn();
      render(
        <Input
          type="autocomplete"
          label="עיר מגורים"
          state=""
          setState={setState}
          options={stringOptions}
        />
      );

      const autocompleteInput = screen.getByLabelText('עיר מגורים');
      fireEvent.focus(autocompleteInput);
      fireEvent.change(autocompleteInput, { target: { value: 'חיפה' } });

      const option = await screen.findByRole('option', { name: 'חיפה' });
      fireEvent.click(option);

      expect(setState).toHaveBeenCalledWith('חיפה');
    });

    it('renders autocomplete with object options and matches value', () => {
      render(
        <Input
          type="autocomplete"
          label="קטגוריית פעולה"
          state="work_mgmt"
          options={objectOptions}
        />
      );
      const autocompleteInput = screen.getByLabelText('קטגוריית פעולה');
      expect(autocompleteInput).toHaveValue('ניהול עבודה');
    });

    it('calls setState with correct value when object option is chosen', async () => {
      const setState = vi.fn();
      render(
        <Input
          type="autocomplete"
          label="קטגוריית פעולה"
          state=""
          setState={setState}
          options={objectOptions}
        />
      );

      const autocompleteInput = screen.getByLabelText('קטגוריית פעולה');
      fireEvent.focus(autocompleteInput);
      fireEvent.change(autocompleteInput, { target: { value: 'ניהול עובדים' } });

      const option = await screen.findByRole('option', { name: 'ניהול עובדים' });
      fireEvent.click(option);

      expect(setState).toHaveBeenCalledWith('emp_mgmt');
    });

    it('handles empty/undefined values gracefully without breaking', () => {
      render(
        <Input
          type="autocomplete"
          label="קטגוריית פעולה"
          state={undefined}
          options={objectOptions}
        />
      );
      const autocompleteInput = screen.getByLabelText('קטגוריית פעולה');
      expect(autocompleteInput).toHaveValue('');
    });
  });

  describe('Type Aliases (textInput, selectInput, autocompleteInput)', () => {
    it('renders text input when type is textInput', () => {
      render(<Input type="textInput" label="שם פרטי" value="ישראל" />);
      expect(screen.getByLabelText('שם פרטי')).toHaveValue('ישראל');
    });

    it('renders select input when type is selectInput', () => {
      render(
        <Input
          type="selectInput"
          label="סוג חשבון"
          state="basic"
          options={[{ label: 'בסיסי', value: 'basic' }]}
        />
      );
      expect(screen.getByLabelText('סוג חשבון')).toHaveTextContent('בסיסי');
    });

    it('renders autocomplete input when type is autocompleteInput', () => {
      render(
        <Input
          type="autocompleteInput"
          label="עיר"
          state="חיפה"
          options={['חיפה', 'תל אביב']}
        />
      );
      expect(screen.getByLabelText('עיר')).toHaveValue('חיפה');
    });
  });
});

