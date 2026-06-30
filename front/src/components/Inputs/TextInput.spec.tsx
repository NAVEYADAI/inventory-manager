import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextInput from './TextInput';

describe('TextInput component', () => {
  it('renders with label and value', () => {
    render(<TextInput label="שם משתמש" value="test-val" />);
    const input = screen.getByLabelText('שם משתמש');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test-val');
  });

  it('triggers setState on change', () => {
    const setState = vi.fn();
    render(<TextInput label="שם משתמש" state="" setState={setState} />);
    const input = screen.getByLabelText('שם משתמש');
    fireEvent.change(input, { target: { value: 'new-value' } });
    expect(setState).toHaveBeenCalledWith('new-value');
  });

  it('toggles password visibility when clicking the show/hide icon', () => {
    render(<TextInput label="סיסמה" type="password" value="secret" />);
    const input = screen.getByLabelText('סיסמה');
    expect(input).toHaveAttribute('type', 'password');

    const button = screen.getByLabelText('toggle password visibility');
    expect(button).toBeInTheDocument();

    // Click to show password
    fireEvent.click(button);
    expect(input).toHaveAttribute('type', 'text');

    // Click to hide password again
    fireEvent.click(button);
    expect(input).toHaveAttribute('type', 'password');
  });
});
