import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalLoadingSpinner } from "./LegalLoadingSpinner";
import { MediationAnalysis } from "./MediationAnalysis";
import { ArrowLeft } from "lucide-react";

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

  const analyzeFiles = async (uploadedFiles: File[]) => {
    setIsAnalyzing(true);
    try {
      const startTime = Date.now();

      // Simulate analysis
      const mockAnalysis = {
        overview: {
          title: "Case Overview & Dynamics",
          content: [
            "Multi-party commercial dispute involving breach of contract and intellectual property claims",
            "Total claimed damages: $2.8M with significant reputational considerations",
            "Key relationship dynamics indicate potential for business continuity post-settlement",
            "Time-sensitive elements due to pending regulatory deadlines"
          ]
        },
        risks: {
          title: "Risk Assessment & Leverage Points",
          content: [
            "Plaintiff's position strengthened by documented email exchanges and witness statements",
            "Defendant's counterclaim lacks substantial evidence but raises valid procedural concerns",
            "80% probability of successful mediation based on party engagement and case complexity",
            "Critical opportunity window in next 45 days before significant cost escalation"
          ]
        },
        settlement: {
          title: "Settlement Framework & Valuation",
          content: [
            "Recommended settlement range: $1.8M - $2.2M based on comparable case outcomes",
            "Non-monetary terms identified: IP licensing agreement, future business collaboration",
            "Structured payment options available with 24-month maximum term",
            "Tax implications favor settlement before end of fiscal quarter"
          ]
        },
        strategy: {
          title: "Strategic Recommendations",
          content: [
            "Begin with joint session focusing on future business opportunities rather than past grievances",
            "Utilize bracketing technique with initial range of $1.5M - $2.5M",
            "Address non-monetary terms early to build momentum through quick wins",
            "Consider mediator's proposal if parties remain within 20% gap after third round"
          ]
        }
      };

      // Ensure minimum 7 second duration
      const analysisTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 7000 - analysisTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetFileUpload = () => {
    setFiles([]);
    setAnalysis(null);
    setIsAnalyzing(false);
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
              />
              
              <div className="flex flex-col items-center justify-center text-center cursor-pointer" onClick={triggerFileInput}>
                <Upload className="h-12 w-12 text-legal-gray mb-4" />
                <p className="text-lg font-medium text-legal-offwhite mb-2 text-center">
                  Drag and drop your case files here
                </p>
                <p className="text-sm text-legal-gray mb-4 text-center">
                  or click to select files
                </p>
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
