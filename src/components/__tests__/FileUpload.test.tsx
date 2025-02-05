
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileUpload } from '../FileUpload';
import { vi } from 'vitest';
import { supabase } from "@/integrations/supabase/client";

vi.mock('../LegalLoadingSpinner', () => ({
  LegalLoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock('../MediationAnalysis', () => ({
  MediationAnalysis: () => <div data-testid="mediation-analysis">Analysis</div>,
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('FileUpload', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not show reset button initially', () => {
    render(<FileUpload />);
    expect(screen.queryByTestId('reset-upload-button')).not.toBeInTheDocument();
  });

  it('should handle successful file analysis', async () => {
    const mockAnalysis = {
      overview: { title: 'Overview', content: ['point 1'] },
      risks: { title: 'Risks', content: ['risk 1'] },
      settlement: { title: 'Settlement', content: ['option 1'] },
      strategy: { title: 'Strategy', content: ['strategy 1'] },
    };

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockAnalysis,
      error: null,
    });

    render(<FileUpload />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/select files/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByTestId('mediation-analysis')).toBeInTheDocument();
    expect(screen.getByTestId('reset-upload-button')).toBeInTheDocument();
  });

  it('should handle file analysis error', async () => {
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error('Analysis failed'));

    render(<FileUpload />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/select files/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.queryByTestId('mediation-analysis')).not.toBeInTheDocument();
    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
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

  it('should reset state when clicking the reset button', async () => {
    const mockAnalysis = {
      overview: { title: 'Overview', content: ['point 1'] },
      risks: { title: 'Risks', content: ['risk 1'] },
      settlement: { title: 'Settlement', content: ['option 1'] },
      strategy: { title: 'Strategy', content: ['strategy 1'] },
    };

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockAnalysis,
      error: null,
    });

    render(<FileUpload />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/select files/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    const resetButton = screen.getByTestId('reset-upload-button');
    expect(resetButton).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(screen.queryByTestId('reset-upload-button')).not.toBeInTheDocument();
    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mediation-analysis')).not.toBeInTheDocument();
  });
});
