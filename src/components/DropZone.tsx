
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  triggerFileInput: () => void;
}

export const DropZone = ({ dragActive, onDrag, onDrop, triggerFileInput }: DropZoneProps) => {
  return (
    <div
      className={`relative rounded-lg border-2 border-dashed transition-colors ${
        dragActive ? "border-legal-blue" : "border-legal-gray/30"
      } p-8 bg-legal-charcoal/30`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <input
        type="file"
        multiple
        className="hidden"
        id="file-upload"
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          if (files.length > 0) {
            const event = new CustomEvent('filesSelected', { detail: files });
            window.dispatchEvent(event);
          }
        }}
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
  );
};
