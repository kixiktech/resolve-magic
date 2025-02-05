
import { motion, AnimatePresence } from "framer-motion";
import { Scale } from "lucide-react";
import { useState, useEffect } from "react";

const ANALYSIS_PHRASES = [
  "Analyzing Case Documents...",
  "Identifying Key Arguments...",
  "Evaluating Settlement Potential...",
  "Processing Legal Context...",
  "Assessing Resolution Paths...",
  "Calculating Settlement Range..."
];

export const LegalLoadingSpinner = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => 
        prev === ANALYSIS_PHRASES.length - 1 ? prev : prev + 1
      );
    }, 2500); // Changed from 1000 to 2500 milliseconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      <div className="relative">
        <motion.div
          className="w-24 h-24 flex items-center justify-center"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Scale className="h-16 w-16 text-legal-gold" />
        </motion.div>
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
        className="mt-8 w-64 h-1 bg-legal-blue/20 rounded-full overflow-hidden fixed bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-legal-gold"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 7,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  );
};
