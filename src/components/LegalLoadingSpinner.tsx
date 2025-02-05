import { motion } from "framer-motion";

export const LegalLoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="w-16 h-16 border-4 border-primary rounded-full"
        animate={{
          rotate: 360,
          borderTopColor: "#9b87f5",
          borderRightColor: "#7E69AB",
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
        className="mt-4 text-lg text-primary font-semibold"
      >
        Analyzing Documents...
      </motion.p>
    </div>
  );
};