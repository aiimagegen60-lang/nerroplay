
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image_provided, manual_data, recommendation_requested, image } = await req.json()

    // 1. Get Keys from Environment or Supabase Secrets Table
    const OPENROUTER_KEY = Deno.env.get('OPENROUTER_API_KEY');

    if (!OPENROUTER_KEY) {
      throw new Error("OPENROUTER_API_KEY is not set in Edge Function Secrets");
    }

    const prompt = `You are an advanced AC Intelligence system. 
    Analyze the provided AC energy label image (if provided) and merge with manual inputs.
    
    INPUT CONTEXT:
    image_provided: ${image_provided}
    manual_data: ${JSON.stringify(manual_data)}
    recommendation_requested: ${recommendation_requested}
    
    ---
    RETURN STRICT JSON:
    {
      "detected_data": { "star_rating": number, "iseer": number, "annual_units": number, "ac_type": string, "brand": string },
      "final_data_used": { "star_rating": number, "annual_units": number, "daily_usage_hours": number, "electricity_rate": number },
      "calculation": { "monthly_units": number, "monthly_bill": number },
      "insight": { "efficiency": string, "estimated_savings_if_upgraded": number },
      "cta": { "show_button": true, "text": "Find Best AC Deals (Save More ⚡)" },
      "recommendations": [ { "model_name": string, "type": string, "star_rating": number, "approx_price": string, "key_features": string[], "reason": string } ]
    }`;

    // Note: Edge functions have a 60s timeout, which is usually enough for AI logic
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Or any vision-capable model
        messages: [
          {
            role: "user",
            content: image ? [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image } }
            ] : prompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await response.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
