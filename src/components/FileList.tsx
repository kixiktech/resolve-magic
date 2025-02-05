
import { File, X } from "lucide-react";
import { motion } from "framer-motion";

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export const FileList = ({ files, onRemoveFile }: FileListProps) => {
  return (
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
            onClick={() => onRemoveFile(index)}
            className="text-legal-gray hover:text-legal-burgundy transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
};
