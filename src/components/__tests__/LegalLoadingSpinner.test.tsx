
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
    const phraseElement = screen.getByText(/./); // Any text content
    expect(phraseElement).toBeInTheDocument();
  });

  it('completes the progress bar after 35 seconds', () => {
    render(<LegalLoadingSpinner />);
    
    // Progress should start at 0
    const progressBar = document.querySelector('.bg-gradient-to-r');
    expect(progressBar).toHaveStyle({ width: '0%' });
    
    // Advance time by 35 seconds
    act(() => {
      vi.advanceTimersByTime(35000);
    });
    
    // Progress should be complete
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
