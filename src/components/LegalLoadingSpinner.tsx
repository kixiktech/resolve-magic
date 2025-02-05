
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Gavel } from "lucide-react";
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      <div className="relative">
        <motion.div
          className="w-24 h-24 border-4 border-legal-blue rounded-full"
          animate={{
            rotate: 360,
            borderTopColor: "#C4A349",
            borderRightColor: "#1E3A8A",
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Scale className="w-8 h-8 text-legal-gold" />
        </motion.div>

        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2"
          animate={{
            rotate: 360,
            y: [0, 4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Gavel className="w-6 h-6 text-legal-gold" />
        </motion.div>
      </div>

      <div className="h-8 mt-8 relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhraseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-legal-gold font-semibold absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            {ANALYSIS_PHRASES[currentPhraseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        className="mt-8 w-64 h-1 bg-legal-blue/20 rounded-full overflow-hidden"
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
