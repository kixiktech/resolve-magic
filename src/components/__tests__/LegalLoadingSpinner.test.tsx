
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LegalLoadingSpinner } from '../LegalLoadingSpinner';
import { vi } from 'vitest';

describe('LegalLoadingSpinner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the first phrase initially', () => {
    render(<LegalLoadingSpinner />);
    expect(screen.getByText('Analyzing Case Documents...')).toBeInTheDocument();
  });

  it('changes phrases over time with 2.5 second intervals', () => {
    render(<LegalLoadingSpinner />);
    
    // Initial phrase
    expect(screen.getByText('Analyzing Case Documents...')).toBeInTheDocument();
    
    // After 2.5 seconds
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(screen.getByText('Identifying Key Arguments...')).toBeInTheDocument();
    
    // After another 2.5 seconds
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(screen.getByText('Evaluating Settlement Potential...')).toBeInTheDocument();
  });

  it('renders the Scale icon', () => {
    render(<LegalLoadingSpinner />);
    const scaleIcon = document.querySelector('svg');
    expect(scaleIcon).toBeInTheDocument();
  });

  it('renders a progress bar', () => {
    render(<LegalLoadingSpinner />);
    const progressBar = document.querySelector('.bg-legal-gold');
    expect(progressBar).toBeInTheDocument();
  });
});
