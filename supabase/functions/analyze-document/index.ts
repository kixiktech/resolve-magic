
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentContent } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI legal assistant analyzing legal documents for mediation. 
            Analyze the provided document and structure your response in these sections:
            1. Case Overview & Dynamics
            2. Risk Assessment & Leverage Points
            3. Settlement Framework & Valuation
            4. Strategic Recommendations
            Each section should have 3-4 key points.`
          },
          { role: 'user', content: documentContent }
        ],
      }),
    });

    const data = await response.json();
    
    // Parse the response into our expected format
    const analysisText = data.choices[0].message.content;
    const sections = analysisText.split(/\d\.\s+/).filter(Boolean);
    
    const analysis = {
      overview: {
        title: "Case Overview & Dynamics",
        content: sections[0].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2))
      },
      risks: {
        title: "Risk Assessment & Leverage Points",
        content: sections[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2))
      },
      settlement: {
        title: "Settlement Framework & Valuation",
        content: sections[2].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2))
      },
      strategy: {
        title: "Strategic Recommendations",
        content: sections[3].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2))
      }
    };

    return new Response(JSON.stringify(analysis), {
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
