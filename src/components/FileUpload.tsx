import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalLoadingSpinner } from "./LegalLoadingSpinner";
import { MediationAnalysis } from "./MediationAnalysis";

export const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const analyzeFiles = async (uploadedFiles: File[]) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const file = uploadedFiles[0]; // Process first file for now
      const content = await file.text();
      
      const response = await fetch('/functions/v1/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentContent: content }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const analysisResult = await response.json();
      setAnalysis(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      setError("Failed to analyze document. Please try again.");
      setFiles([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetFileUpload = () => {
    setFiles([]);
    setAnalysis(null);
    setIsAnalyzing(false);
    setError(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
    await analyzeFiles(droppedFiles);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...selectedFiles]);
    await analyzeFiles(selectedFiles);
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
            <div
              className={`relative rounded-lg border-2 border-dashed transition-colors ${
                dragActive ? "border-legal-blue" : "border-legal-gray/30"
              } p-8 bg-legal-charcoal/30`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={handleFileInput}
                aria-label="select files"
                accept=".txt,.doc,.docx,.pdf"
              />
              
              <div className="flex flex-col items-center justify-center text-center cursor-pointer" onClick={triggerFileInput}>
                <Upload className="h-12 w-12 text-legal-gray mb-4" />
                <p className="text-lg font-medium text-legal-offwhite mb-2 text-center">
                  Drag and drop your case files here
                </p>
                <p className="text-sm text-legal-gray mb-4 text-center">
                  or click to select files
                </p>
                {error && (
                  <p className="text-red-500 mb-4">{error}</p>
                )}
                <Button 
                  variant="outline" 
                  className="bg-legal-blue/10 text-legal-gold border-legal-blue/20 hover:bg-legal-blue/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                >
                  Select Files
                </Button>
              </div>
            </div>
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-legal-charcoal/50 border border-legal-blue/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-legal-gray" />
                  <span className="text-sm font-medium text-legal-offwhite">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-legal-gray hover:text-legal-burgundy transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
