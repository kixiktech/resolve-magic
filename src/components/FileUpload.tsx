
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalLoadingSpinner } from "./LegalLoadingSpinner";
import { MediationAnalysis } from "./MediationAnalysis";
import { DropZone } from "./DropZone";
import { FileList } from "./FileList";
import { analyzeFile } from "@/utils/fileAnalysis";

export const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await analyzeFile(newFiles[0]);
      if (!error && data) {
        setAnalysis(data);
      } else {
        setFiles([]);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleFiles(droppedFiles);
  };

  useEffect(() => {
    const handleFileSelection = (e: CustomEvent<File[]>) => {
      handleFiles(e.detail);
    };

    window.addEventListener('filesSelected', handleFileSelection as EventListener);
    return () => {
      window.removeEventListener('filesSelected', handleFileSelection as EventListener);
    };
  }, []);

  const resetFileUpload = () => {
    setFiles([]);
    setAnalysis(null);
    setIsAnalyzing(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setAnalysis(null);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {analysis && !isAnalyzing && (
        <div className="mb-6">
          <Button
            onClick={resetFileUpload}
            variant="ghost"
            className="text-legal-offwhite hover:text-legal-gold hover:bg-legal-blue/10"
            data-testid="reset-upload-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Upload New Document
          </Button>
        </div>
      )}
      
      <AnimatePresence>
        {!isAnalyzing && !analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DropZone
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              triggerFileInput={triggerFileInput}
            />
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LegalLoadingSpinner />
          </motion.div>
        )}

        {analysis && !isAnalyzing && (
          <MediationAnalysis analysis={analysis} />
        )}

        {files.length > 0 && !isAnalyzing && !analysis && (
          <FileList files={files} onRemoveFile={removeFile} />
        )}
      </AnimatePresence>
    </div>
  );
};
