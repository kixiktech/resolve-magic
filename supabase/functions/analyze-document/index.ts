
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

    if (!documentContent) {
      throw new Error('Document content is required');
    }

    if (typeof documentContent !== 'string') {
      throw new Error('Document content must be a string');
    }

    console.log('Received document for analysis, length:', documentContent.length);

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
            content: `You are a highly experienced legal mediator analyzing legal documents. 
            Your task is to provide a comprehensive analysis that helps mediators understand and navigate the case effectively.
            
            Structure your analysis in these sections, with precise and concise bullet points:

            1. Case Overview & Dynamics
            - Key parties involved and their relationships
            - Core issues and claims
            - Emotional dynamics and underlying interests
            - Procedural history and current status

            2. Risk Assessment & Leverage Points
            - Strengths and weaknesses of each party's position
            - Legal precedents and statutory considerations
            - Evidence analysis and credibility issues
            - Financial risks and potential exposure

            3. Settlement Framework & Valuation
            - Comparable case outcomes and settlement ranges
            - Non-monetary considerations and creative solutions
            - Tax implications and structured settlement options
            - Timing considerations and urgency factors

            4. Strategic Recommendations
            - Proposed negotiation strategy and approach
            - Key talking points and discussion frameworks
            - Potential roadblocks and mitigation strategies
            - Next steps and action items

            IMPORTANT: Format EXACTLY as specified:
            1. Start each section with the number and title
            2. Use "-" for bullet points
            3. Include EXACTLY these four sections
            4. Make each point clear and actionable`
          },
          { role: 'user', content: documentContent }
        ],
        temperature: 0.5,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    console.log('OpenAI API response received');
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    const analysisText = data.choices[0].message.content;
    
    // More robust section parsing
    const sections = analysisText
      .split(/\d\.\s+/)
      .filter(Boolean)
      .map(section => section.trim());
    
    if (sections.length !== 4) {
      console.error('Raw OpenAI response:', analysisText);
      console.error('Parsed sections:', sections);
      throw new Error(`Expected 4 sections, got ${sections.length}`);
    }

    // Enhanced parsing with better validation
    const parseSection = (content: string): string[] => {
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid section content');
      }

      const points = content
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(1).trim())
        .filter(Boolean);
      
      if (points.length === 0) {
        console.error('Section content:', content);
        throw new Error('No valid bullet points found in section');
      }
      
      return points;
    };

    try {
      const analysis = {
        overview: {
          title: "Case Overview & Dynamics",
          content: parseSection(sections[0])
        },
        risks: {
          title: "Risk Assessment & Leverage Points",
          content: parseSection(sections[1])
        },
        settlement: {
          title: "Settlement Framework & Valuation",
          content: parseSection(sections[2])
        },
        strategy: {
          title: "Strategic Recommendations",
          content: parseSection(sections[3])
        }
      };

      // Final validation
      Object.entries(analysis).forEach(([key, section]) => {
        if (!section.content.length) {
          throw new Error(`Empty content in section: ${section.title}`);
        }
      });

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Parsing error:', parseError);
      console.error('Raw sections:', sections);
      throw new Error(`Failed to parse analysis: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
