import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LegalLoadingSpinner } from "./LegalLoadingSpinner";
import { MediationAnalysis } from "./MediationAnalysis";

export const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

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
      // Here you would integrate with OpenAI API through your Supabase backend
      // For now, we'll simulate the analysis with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated analysis result
      setAnalysis({
        overview: {
          title: "Case Overview",
          content: [
            "Dispute between Company A and Company B regarding contract breach",
            "Estimated case value: $500,000",
            "Duration of dispute: 8 months"
          ]
        },
        risks: {
          title: "Risks & Opportunities",
          content: [
            "High probability of successful mediation",
            "Key evidence supports plaintiff's position",
            "Defendant shows willingness to negotiate"
          ]
        },
        settlement: {
          title: "Settlement Analysis",
          content: [
            "Recommended settlement range: $350,000 - $450,000",
            "Historical settlement data suggests 85% success rate",
            "Optimal timing for settlement: Within next 30 days"
          ]
        },
        strategy: {
          title: "Negotiation Strategy",
          content: [
            "Focus on maintaining business relationship",
            "Emphasize mutual benefits of early resolution",
            "Consider structured settlement options"
          ]
        }
      });

      toast({
        title: "Analysis Complete",
        description: "Document analysis has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the documents.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
    toast({
      title: "Files uploaded successfully",
      description: `${droppedFiles.length} files have been added`,
    });
    await analyzeFiles(droppedFiles);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...selectedFiles]);
    toast({
      title: "Files uploaded successfully",
      description: `${selectedFiles.length} files have been added`,
    });
    await analyzeFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setAnalysis(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <AnimatePresence>
        {!isAnalyzing && !analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className={`relative rounded-lg border-2 border-dashed transition-colors ${
                dragActive ? "border-primary" : "border-zinc-300"
              } p-8`}
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
              />
              
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-12 w-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Drag and drop your case files here
                </p>
                <p className="text-sm text-zinc-500 mb-4">
                  or click to select files
                </p>
                <Button variant="outline">Select Files</Button>
              </label>
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
                className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-zinc-400" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-zinc-400 hover:text-zinc-600"
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