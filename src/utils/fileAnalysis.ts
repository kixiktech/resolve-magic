
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const analyzeFile = async (file: File) => {
  try {
    const content = await file.text();
    
    const { data, error } = await supabase.functions.invoke('analyze-document', {
      body: { documentContent: content },
    });

    if (error) {
      throw new Error(error.message);
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
      description: "Failed to analyze document. Please try again.",
      variant: "destructive",
    });
    return { data: null, error };
  }
};
