import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from './navbar';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

// Mock useAuth
vi.mock('../../providers/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

// Mock apiLogout
vi.mock('../../api/login', () => ({
  logout: vi.fn(),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when user is not logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: undefined,
      setUser: vi.fn(),
    });

    const { container } = renderWithRouter(<Navbar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders brand title and navigation links when user is logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'ישראל ישראלי',
        selectedCompany: { id: 1, name: 'חברה א', role: 'admin' },
      },
      setUser: vi.fn(),
    });

    renderWithRouter(<Navbar />);
    
    // Check brand title
    expect(screen.getByText('מנהל המלאי')).toBeInTheDocument();
    
    // Check navigation buttons (Desktop menu buttons should be visible under md screen size)
    expect(screen.getByText('ראשי')).toBeInTheDocument();
    expect(screen.getByText('מתכונים')).toBeInTheDocument();
    expect(screen.getByText('לוח שנה')).toBeInTheDocument();
  });

  it('displays user profile button with initial letter', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'ישראל ישראלי',
        selectedCompany: { id: 1, name: 'חברה א', role: 'owner' },
      },
      setUser: vi.fn(),
    });

    renderWithRouter(<Navbar />);
    
    // Displays 'י' (first letter of 'ישראל')
    const profileBtn = screen.getByText('י');
    expect(profileBtn).toBeInTheDocument();
  });
});
