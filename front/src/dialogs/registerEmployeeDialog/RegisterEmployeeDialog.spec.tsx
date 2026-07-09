import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterEmployeeDialog from './RegisterEmployeeDialog';
import axiosInstance from '../../api/axiosInstance';

// Mock axiosInstance
vi.mock('../../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock BaseDialog to render its children directly for simple querying in RTL
vi.mock('../../components/BaseDialog/BaseDialog', () => ({
  default: ({ children, title, actions, onSubmit }: any) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} data-testid="base-dialog-form">
      <h2>{title}</h2>
      <div>{children}</div>
      <div>{actions}</div>
    </form>
  ),
}));

// Mock localStorage for JSDOM compatibility
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

describe('RegisterEmployeeDialog', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    companyId: 1,
    onSave: vi.fn(),
    currentEmployees: [
      { id: 10, role: 'owner', user: { id: 100, name: 'ownerUser', email: 'owner@test.com' } }
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem('user', JSON.stringify({
      id: 100,
      selectedCompany: { id: 1, role: 'owner' }
    }));
  });

  it('renders a text field for entering existing employee identifier', async () => {
    render(<RegisterEmployeeDialog {...defaultProps} />);

    // Check that the text field for identifier is visible
    expect(screen.getByLabelText(/שם משתמש או תעודת זהות/)).toBeInTheDocument();
  });

  it('supports switching tabs between add existing user and registering a new user', async () => {
    render(<RegisterEmployeeDialog {...defaultProps} />);

    // "הוספת משתמש קיים" tab is active by default, check identifier field is present
    expect(screen.getByLabelText(/שם משתמש או תעודת זהות/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^שם משתמש( \*|$)/)).not.toBeInTheDocument();

    // Click on "רישום משתמש חדש" tab
    const registerTab = screen.getByText('רישום משתמש חדש');
    fireEvent.click(registerTab);

    // Expect signup fields to render now
    expect(screen.getByLabelText(/^שם משתמש( \*|$)/)).toBeInTheDocument();
    expect(screen.getByLabelText(/סיסמה/)).toBeInTheDocument();
    expect(screen.getByLabelText(/כתובת אימייל/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^תעודת זהות( \*|$)/)).toBeInTheDocument();
  });

  it('submits correctly for existing user', async () => {
    (axiosInstance.post as any).mockResolvedValue({ data: { success: true } });

    render(<RegisterEmployeeDialog {...defaultProps} />);

    const idInput = screen.getByLabelText(/שם משתמש או תעודת זהות/);
    fireEvent.change(idInput, { target: { value: 'existingUser' } });

    const submitBtn = screen.getByRole('button', { name: 'הוסף עובד' });
    fireEvent.click(submitBtn);

    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/company/1/employees',
      expect.objectContaining({
        identifier: 'existingUser',
        role: 'editor',
      })
    );
  });
});
