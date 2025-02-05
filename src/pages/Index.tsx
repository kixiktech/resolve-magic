import { Hero } from "@/components/Hero";
import { FileUpload } from "@/components/FileUpload";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Hero />
      <FileUpload />
    </motion.div>
  );
};

export default Index;