
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { data } = await req.json()
    const GROQ_KEY = Deno.env.get('GROQ_API_KEY');

    if (!GROQ_KEY) {
      throw new Error("GROQ_API_KEY is not set in Edge Function Secrets");
    }

    const prompt = `You are a professional Vedic Astrologer. 
    Analyze the following Kundli data and provide a detailed, professional interpretation in Markdown.
    
    DATA:
    User: ${data.userName}
    Zodiac: ${data.zodiac}
    Nakshatra: ${data.nakshatra}
    Dosha: ${data.isManglik === 'Yes' ? 'Mangal Dosha Present' : 'No Major Dosha'}
    Planets: ${JSON.stringify(data.planets)}
    
    Structure your response with:
    1. Overall Personality
    2. Career & Finance
    3. Love & Relationships
    4. Health & Vitality
    5. Actionable Remedies & Tips`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000
      }),
    });

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
