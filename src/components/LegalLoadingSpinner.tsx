
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const ANALYSIS_PHRASES = [
  "Scanning Deposition Transcripts...",
  "Identifying Key Witness Statements...",
  "Extracting Timeline Details...",
  "Analyzing Credibility Indicators...",
  "Mapping Case Chronology...",
  "Categorizing Testimony Themes...",
  "Evaluating Expert Testimonies...",
  "Cross-Reference Checking...",
  "Detecting Inconsistencies...",
  "Compiling Exhibit References...",
  "Assessing Witness Demeanor...",
  "Highlighting Critical Admissions...",
  "Organizing Factual Disputes...",
  "Structuring Key Arguments...",
  "Building Case Narrative..."
];

export const LegalLoadingSpinner = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [usedPhrases, setUsedPhrases] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  // Reset progress and phrases when component mounts
  useEffect(() => {
    const TOTAL_DURATION = 35000; // 35 seconds in milliseconds
    const UPDATE_INTERVAL = 100; // Update every 100ms
    const STEPS = TOTAL_DURATION / UPDATE_INTERVAL;
    const INCREMENT = 100 / STEPS;

    setProgress(0);
    setUsedPhrases([]);
    
    const startTime = Date.now();
    
    // Start progress bar
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime >= TOTAL_DURATION) {
        setProgress(100);
        clearInterval(progressInterval);
      } else {
        setProgress((elapsedTime / TOTAL_DURATION) * 100);
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(progressInterval);
  }, []);

  // Function to get random unused phrase
  const getNextPhrase = () => {
    const availablePhrases = ANALYSIS_PHRASES
      .map((_, index) => index)
      .filter(index => !usedPhrases.includes(index));

    if (availablePhrases.length === 0) {
      setUsedPhrases([]);
      return Math.floor(Math.random() * ANALYSIS_PHRASES.length);
    }

    const randomIndex = Math.floor(Math.random() * availablePhrases.length);
    const nextPhraseIndex = availablePhrases[randomIndex];
    
    setUsedPhrases(prev => [...prev, nextPhraseIndex]);
    return nextPhraseIndex;
  };

  // Handle phrase rotation
  useEffect(() => {
    const getRandomDuration = () => Math.floor(Math.random() * (7000 - 3000) + 3000);
    let timeoutId: NodeJS.Timeout;

    const rotatePhrase = () => {
      setCurrentPhraseIndex(getNextPhrase());
      timeoutId = setTimeout(rotatePhrase, getRandomDuration());
    };

    timeoutId = setTimeout(rotatePhrase, getRandomDuration());

    return () => clearTimeout(timeoutId);
  }, [usedPhrases]);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      <div className="relative">
        <div className="loader w-24 h-24">
          <div className="loaderMiniContainer">
            <div className="barContainer">
              <span className="bar"></span>
              <span className="bar bar2"></span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 101 114"
              className="svgIcon"
            >
              <circle
                strokeWidth="7"
                stroke="#C4A349"
                transform="rotate(36.0692 46.1726 46.1727)"
                r="29.5497"
                cy="46.1727"
                cx="46.1726"
              ></circle>
              <line
                strokeWidth="7"
                stroke="#C4A349"
                y2="111.784"
                x2="97.7088"
                y1="67.7837"
                x1="61.7089"
              ></line>
            </svg>
          </div>
        </div>
      </div>

      <div className="h-8 mt-8 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhraseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-legal-gold font-semibold absolute text-center"
          >
            {ANALYSIS_PHRASES[currentPhraseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        className="mt-8 w-64 h-2 bg-legal-blue/20 rounded-full overflow-hidden fixed bottom-8 shadow-[0_0_10px_rgba(196,163,73,0.3)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-legal-gold/80 via-legal-gold to-legal-gold/80 shadow-[0_0_15px_rgba(196,163,73,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </motion.div>
    </div>
  );
};
