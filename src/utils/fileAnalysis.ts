
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const analyzeFile = async (file: File) => {
  try {
    const content = await file.text();
    
    if (!content.trim()) {
      throw new Error("The file appears to be empty");
    }
    
    const { data, error } = await supabase.functions.invoke('analyze-document', {
      body: { documentContent: content },
    });

    if (error) {
      console.error('Analysis error:', error);
      throw new Error(error.message);
    }

    if (!data || typeof data !== 'object') {
      console.error('Invalid response data:', data);
      throw new Error('Invalid response from analysis service');
    }

    toast({
      title: "Analysis Complete",
      description: "The document has been successfully analyzed.",
    });

    return { data, error: null };
  } catch (error) {
    console.error("Analysis failed:", error);
    toast({
      title: "Analysis Failed",
      description: error.message || "Failed to analyze document. Please try again.",
      variant: "destructive",
    });
    return { data: null, error };
  }
};
