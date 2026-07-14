import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PendingPreparationsPage from './PendingPreparationsPage';
import { getProductExecutions, updateProductExecution } from '../../api/createProduct';
import { BrowserRouter } from 'react-router-dom';

// Mock the API client
vi.mock('../../api/createProduct', () => ({
  getProductExecutions: vi.fn(),
  updateProductExecution: vi.fn(),
}));

// Mock TextInput component as a standard TextField since TextInput is a custom component
vi.mock('../../components/Inputs/TextInput', () => ({
  default: ({ label, placeholder, value, onChange, slotProps, ...props }: any) => (
    <div data-testid="mock-text-input">
      <label>{label || placeholder}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={props.type || 'text'}
        {...props}
      />
    </div>
  ),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('PendingPreparationsPage', () => {
  const mockExecutions = [
    {
      id: 1,
      recipe: {
        id: 10,
        name: 'לחם מחמצת',
        yieldType: 'UNITS' as const,
      },
      batche_count: 2,
      created_time: '2026-07-09T12:00:00Z',
      updated_time: '2026-07-09T12:00:00Z',
      actualYield: null,
    },
    {
      id: 2,
      recipe: {
        id: 20,
        name: 'עוגת שוקולד',
        yieldType: 'WEIGHT' as const,
      },
      batche_count: 1,
      created_time: '2026-07-09T13:00:00Z',
      updated_time: '2026-07-09T13:00:00Z',
      actualYield: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    const store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        for (const key in store) {
          delete store[key];
        }
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    });

    window.localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        selectedCompany: { id: 1, name: 'חברה א', subscriptionId: 1 },
      })
    );
  });

  it('renders the page and shows empty state when there are no preparations', async () => {
    vi.mocked(getProductExecutions).mockResolvedValue([]);

    renderWithRouter(<PendingPreparationsPage />);

    await waitFor(() => {
      expect(screen.getByText('השלמת כמויות הכנה')).toBeInTheDocument();
      expect(screen.getByText('אין הכנות להשלמה!')).toBeInTheDocument();
    });
  });

  it('renders pending preparations when they exist', async () => {
    vi.mocked(getProductExecutions).mockResolvedValue(mockExecutions);

    renderWithRouter(<PendingPreparationsPage />);

    await waitFor(() => {
      expect(screen.getByText('לחם מחמצת')).toBeInTheDocument();
      expect(screen.getByText('עוגת שוקולד')).toBeInTheDocument();
    });

    expect(screen.queryByText('אין הכנות להשלמה!')).not.toBeInTheDocument();
  });

  it('filters executions by recipe name when searching', async () => {
    vi.mocked(getProductExecutions).mockResolvedValue(mockExecutions);

    renderWithRouter(<PendingPreparationsPage />);

    await waitFor(() => {
      expect(screen.getByText('לחם מחמצת')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('חפש לפי שם מתכון...');
    fireEvent.change(searchInput, { target: { value: 'עוגת' } });

    expect(screen.queryByText('לחם מחמצת')).not.toBeInTheDocument();
    expect(screen.getByText('עוגת שוקולד')).toBeInTheDocument();
  });

  it('submits actual yield successfully when clicking save', async () => {
    vi.mocked(getProductExecutions).mockResolvedValue(mockExecutions);
    vi.mocked(updateProductExecution).mockResolvedValue({ id: 1 } as any);

    renderWithRouter(<PendingPreparationsPage />);

    await waitFor(() => {
      expect(screen.getByText('לחם מחמצת')).toBeInTheDocument();
    });

    // The first item is 'לחם מחמצת' (UNITS)
    const inputs = screen.getAllByPlaceholderText('למשל: 50');
    fireEvent.change(inputs[0], { target: { value: '45' } });

    const saveButtons = screen.getAllByRole('button', { name: 'שמור' });
    fireEvent.click(saveButtons[0]);

    expect(updateProductExecution).toHaveBeenCalledWith(1, { actualYield: 45 });
  });
});
