
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const simulatedAnalysis = {
  overview: {
    title: "Case Overview & Dynamics",
    content: [
      "Parties involved: Smith Manufacturing vs. Jones Distribution Corp",
      "Core dispute centers on breach of supply contract worth $2.5M",
      "High emotional tension due to 15-year business relationship",
      "Case is in pre-litigation phase with formal demands exchanged"
    ]
  },
  risks: {
    title: "Risk Assessment & Leverage Points",
    content: [
      "Smith has strong documentary evidence of contract terms",
      "Jones claims force majeure due to supply chain disruptions",
      "Potential precedent from similar cases favors plaintiff",
      "Estimated litigation costs exceed $300,000 for each party"
    ]
  },
  settlement: {
    title: "Settlement Framework & Valuation",
    content: [
      "Comparable cases settled in $1.2M to $1.8M range",
      "Potential for structured payment plan over 24 months",
      "Tax implications favor immediate settlement",
      "Early resolution could preserve business relationship"
    ]
  },
  strategy: {
    title: "Strategic Recommendations",
    content: [
      "Start with interest-based negotiation approach",
      "Focus on future business opportunities as leverage",
      "Consider third-party neutral evaluation",
      "Set 90-day timeline for resolution before litigation"
    ]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentContent } = await req.json();

    if (!documentContent) {
      throw new Error('Document content is required');
    }

    if (typeof documentContent !== 'string') {
      throw new Error('Document content must be a string');
    }

    console.log('Received document for analysis, length:', documentContent.length);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    return new Response(JSON.stringify(simulatedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
