
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileUpload } from '../FileUpload';
import { vi } from 'vitest';

// Mock the components and hooks we depend on
vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('../LegalLoadingSpinner', () => ({
  LegalLoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock('../MediationAnalysis', () => ({
  MediationAnalysis: () => <div data-testid="mediation-analysis">Analysis</div>,
}));

describe('FileUpload', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should trigger file input when clicking the select files button', () => {
    render(<FileUpload />);
    
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    const selectButton = screen.getByText('Select Files');
    
    fireEvent.click(selectButton);
    
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should show loading state for minimum 7 seconds', async () => {
    render(<FileUpload />);
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/select files/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('mediation-analysis')).toBeInTheDocument();
  });

  it('should handle drag and drop', async () => {
    render(<FileUpload />);
    
    const dropZone = screen.getByText(/drag and drop/i).parentElement;
    expect(dropZone).toBeInTheDocument();

    await act(async () => {
      fireEvent.dragEnter(dropZone!);
    });

    expect(dropZone).toHaveClass('border-legal-blue');

    await act(async () => {
      fireEvent.dragLeave(dropZone!);
    });

    expect(dropZone).not.toHaveClass('border-legal-blue');
  });

  it('should handle file removal', async () => {
    render(<FileUpload />);
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/select files/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await act(async () => {
      vi.advanceTimersByTime(7000);
    });

    const removeButton = screen.getByRole('button', { name: /remove/i });
    
    await act(async () => {
      fireEvent.click(removeButton);
    });

    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
  });
});
