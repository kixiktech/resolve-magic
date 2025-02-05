import { motion } from "framer-motion";

export const LegalLoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="w-16 h-16 border-4 border-legal-blue rounded-full"
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
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-lg text-legal-gold font-semibold"
      >
        Analyzing Documents...
      </motion.p>
    </div>
  );
};