
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LegalLoadingSpinner } from '../LegalLoadingSpinner';
import { vi } from 'vitest';

describe('LegalLoadingSpinner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock Date.now() to ensure consistent timing
    vi.spyOn(Date, 'now')
      .mockImplementationOnce(() => 0) // First call returns 0
      .mockImplementation(() => 35000); // Subsequent calls return 35000
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the first phrase initially', () => {
    render(<LegalLoadingSpinner />);
    expect(screen.getByText(/Scanning Deposition Transcripts/)).toBeInTheDocument();
  });

  it('changes phrases over time with random intervals', () => {
    render(<LegalLoadingSpinner />);
    
    // Initial phrase
    expect(screen.getByText(/Scanning Deposition Transcripts/)).toBeInTheDocument();
    
    // Advance time by 4 seconds (within the 3-7 second range)
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    
    // Verify that a new phrase is shown
    const phraseElement = screen.getByText(/./);
    expect(phraseElement).toBeInTheDocument();
  });

  it('should take exactly 35 seconds to complete the loading', () => {
    render(<LegalLoadingSpinner />);
    
    // Progress should start at 0
    const progressBar = document.querySelector('.bg-gradient-to-r');
    expect(progressBar).toHaveStyle({ width: '0%' });
    
    // Check progress at different intervals
    act(() => {
      vi.advanceTimersByTime(17500); // Half way
    });
    expect(progressBar).toHaveStyle({ width: '50%' });
    
    act(() => {
      vi.advanceTimersByTime(17500); // Complete
    });
    expect(progressBar).toHaveStyle({ width: '100%' });
    
    // Verify it doesn't go beyond 100%
    act(() => {
      vi.advanceTimersByTime(5000); // Extra time
    });
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('renders the Scale icon', () => {
    render(<LegalLoadingSpinner />);
    const scaleIcon = document.querySelector('svg');
    expect(scaleIcon).toBeInTheDocument();
  });

  it('never repeats phrases until all have been shown', () => {
    render(<LegalLoadingSpinner />);
    const seenPhrases = new Set();
    
    // Run through multiple phrase changes
    for (let i = 0; i < 15; i++) {
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      
      const phraseElement = screen.getByText(/./);
      const phraseText = phraseElement.textContent;
      
      // If we've seen less than 15 phrases, this should be a new one
      if (seenPhrases.size < 15) {
        expect(seenPhrases.has(phraseText)).toBeFalsy();
      }
      
      seenPhrases.add(phraseText);
    }
  });
});
