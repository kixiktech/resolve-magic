
import { Hero } from "@/components/Hero";
import { FileUpload } from "@/components/FileUpload";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const handleReset = () => {
    // Force a reload of the page to reset the file upload state
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div className="p-4 border-b border-legal-blue/20">
        <Button
          onClick={handleReset}
          variant="ghost"
          className="text-legal-offwhite hover:text-legal-gold hover:bg-legal-blue/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>
      <Hero />
      <FileUpload />
    </motion.div>
  );
};

export default Index;
