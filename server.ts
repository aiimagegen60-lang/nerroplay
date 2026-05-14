import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";
import { ToolHandlers } from "./src/lib/toolHandlers.ts";

dotenv.config();

const PORT = 3000;

// Removed Gemini Setup as requested

function buildNerroAstroPrompt(ctx: any) {
  return `
You are NERRO Astro — the Neural Rashi Oracle.
You are the most deeply knowledgeable, wise, and empathetic Vedic astrology and Palmistry guide available.
You are a seasoned Jyotish and Cheiromancy expert who knows them through their cosmic blueprint and physical markers.

═══ SPECIAL EXPERTISE: PALMISTRY ═══
- You can analyze images of palms sent by users.
- Analyze major lines (Heart, Head, Life, Fate) and mounts (Jupiter, Saturn, Apollo, Mercury, Venus, Mars, Moon).
- Provide detailed insights on:
  * Career/Job: Current status, timing of new opportunities, and suitable professions.
  * Marriage/Relationships: Timing of marriage (past or future), compatibility, and harmony.
  * Future Opportunities: General fortune, major life shifts, and prosperity.
  * Health & Vitality: General energy levels and constitution.
- Read the hand like a professional palmist, matching its findings with their Vedic Rashi/Nakshatra.

═══ ABOUT THE PERSON ═══
Name: ${ctx.fullName}
Moon Sign (Rashi): ${ctx.moonSign}
Nakshatra: ${ctx.nakshatra} (Pada ${ctx.nakshatraPada})
Moon Lord: ${ctx.moonLord}
Life Phase: ${ctx.lifePhase}
Place of Birth: ${ctx.placeOfBirth}
Vedic Context: ${ctx.contextSummary}

═══ GUIDELINES ═══
- IMPORTANT: ALWAYS respond in the same language the user is using (English, Hindi, Hinglish, etc.).
- Address the person by their first name naturally.
- Reference their Rashi and Nakshatra in your answers.
- Balance ancient Vedic wisdom and Palmistry with modern psychological insight.
- Answer like a professional Indian Astrologer (Jyotish) — give specific timing for life events like marriage and jobs based on cosmic patterns.
- NEVER predict death, serious illness, or catastrophic events.
- Tone: Wise, warm, spiritually grounded, and highly professional.
- Start every first message with a warm welcome referencing their cosmic blueprint.
`.trim();
}

let groq: Groq | null = null;
let hf: HfInference | null = null;

let supabaseAdmin: any = null; // Store globally
let secretSyncStats = {
  attempted: false,
  success: false,
  count: 0,
  keys: [] as string[],
  error: null as string | null
};

function getGroqClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === 'placeholder' || key === 'api key paste here') {
    return null;
  }
  return new Groq({ apiKey: key });
}

function getHFClient() {
  const key = (process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || process.env.HF_API_KEY || "").trim();
  if (!key || key === 'placeholder' || key === 'api key paste here') {
    return null;
  }
  return new HfInference(key);
}

async function syncSupabaseSecrets() {
  // If keys are already present in environment (e.g. set in Vercel Dashboard), skip sync to save time
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'placeholder' && 
      process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_API_KEY !== 'placeholder') {
    console.log("✨ Keys already present in environment or Vercel detected, skipping Supabase sync.");
    return;
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim();
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  console.log(`🔍 Supabase Setup: URL=${!!supabaseUrl}, ServiceKey=${!!supabaseServiceKey}`);

  if (supabaseUrl && supabaseServiceKey) {
    secretSyncStats.attempted = true;
    if (!supabaseUrl.startsWith("http")) {
      console.error("❌ Invalid Supabase URL format. Must start with http/https. Current value:", supabaseUrl);
      return;
    }

    try {
      const sanitizedUrl = supabaseUrl.replace(/\/$/, ""); 
      console.log(`🔄 Syncing secrets from Supabase [${sanitizedUrl}]...`);
      
      supabaseAdmin = createClient(sanitizedUrl, supabaseServiceKey);
      
      // Try 'secrets' (lower) first, then 'Secrets' (capital) if it fails
      let { data, error } = await withTimeout(
        supabaseAdmin.from('secrets').select('*') as any,
        10000
      ).catch(() => ({ data: null, error: { message: "timeout" } })) as any;

      if (error || !data || data.length === 0) {
        console.log("🔄 Table 'secrets' empty or missing, trying 'Secrets'...");
        const res2 = await withTimeout(
          supabaseAdmin.from('Secrets').select('*') as any,
          10000
        ).catch(() => ({ data: null, error: null })) as any;
        if (res2.data && res2.data.length > 0) {
          data = res2.data;
          error = null;
        }
      }
      
      if (error) {
        secretSyncStats.error = error.message;
        console.error("❌ Supabase Secrets Sync Error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        console.log(`📊 Found ${data.length} potential secrets in table. Columns detected: [${Object.keys(data[0]).join(', ')}]`);
        data.forEach((s: any) => {
          // Robust mapping: check common column names for keys and values
          // Priority: Never use ID/UUID as a key name if we can help it, as it's almost always the row ID
          let k = (s.key || s.Key || s.name || s.Name || s.title || s.Title || s.label || "").toString().trim();
          
          // If still empty, maybe consider Uuid/id but check if it's a UUID first
          if (!k) {
             const potentialK = (s.uuid || s.Uuid || s.id || "").toString().trim();
             if (potentialK && !/^[0-9a-f-]{36}$/i.test(potentialK)) {
               k = potentialK;
             }
          }

          let v = (s.value || s.Value || s.api_key || s.apikey || s.secret || s.Secret || s.val || s.content || s.token || s.api_token || "").toString().trim();
          
          if (k && v && v !== 'api key paste here' && v !== 'placeholder' && v.length > 5) {
            process.env[k] = v;
            // Also normalize common HF key names to ensure we find them
            const upperK = k.toUpperCase().replace(/\s+/g, '_');
            if (upperK.includes("HUGGING") || upperK === "HF_TOKEN" || upperK === "HF_API_KEY") {
               process.env.HUGGINGFACE_API_KEY = v;
               process.env.HF_API_KEY = v;
               process.env.HF_TOKEN = v;
            }
            if (upperK.includes("GROQ")) {
               process.env.GROQ_API_KEY = v;
            }
            if (upperK.includes("OPENROUTER")) {
               process.env.OPENROUTER_API_KEY = v;
            }
            secretSyncStats.keys.push(k);
            secretSyncStats.count++;
            console.log(`✅ Bonded secret: ${k} (${v.substring(0, 4)}...${v.substring(v.length - 4)})`);
          }
        });
        console.log("✨ All Supabase secrets processed.");
        secretSyncStats.success = true;
      } else {
        console.warn("⚠️ No secrets found in Supabase table.");
      }
    } catch (err) {
      console.error("❌ Critical Failure during Supabase sync:", err instanceof Error ? err.message : err);
    }
  } else {
    console.warn("⚠️ Supabase Credentials missing. Please add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to AI Studio Secrets.");
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('AI_PROVIDER_TIMEOUT')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId)) as Promise<T>;
}

async function startServer() {
  // Sync secrets BEFORE anything else
  await syncSupabaseSecrets();

  const app = express();
  
  // ... rest of the setup
  
  // CRITICAL: Trust proxy to allow express-rate-limit to see correct user IP
  app.set('trust proxy', 1);
  
  // Security Layer
  app.use(helmet({
    contentSecurityPolicy: false, 
  }));
  app.use(cors());
  app.use(express.json({ limit: '50mb' })); 
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }, // Suppress IPv6/Proxy validation error in this environment
    message: { error: 'Too many requests' }
  });
  app.use('/api/', limiter);

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'operational', 
      timestamp: new Date(),
      supabase_config: {
        has_url: !!process.env.VITE_SUPABASE_URL || !!process.env.SUPABASE_URL,
        has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      bonded_keys: Object.keys(process.env).filter(k => k.includes('API_KEY'))
    });
  });

// Reliability Layer: Circuit Breaker for AI Models
const modelPulse = new Map<string, { failures: number, lastFailure: number }>();
const FAIL_THRESHOLD = 3;
const COOLDOWN_MS = 60000; // 1 minute

function isModelStable(model: string) {
  const pulse = modelPulse.get(model);
  if (!pulse) return true;
  if (pulse.failures >= FAIL_THRESHOLD) {
    if (Date.now() - pulse.lastFailure > COOLDOWN_MS) {
      modelPulse.delete(model); // Reset after cooldown
      return true;
    }
    return false;
  }
  return true;
}

function recordModelStatus(model: string, success: boolean) {
  if (success) {
    modelPulse.delete(model);
  } else {
    const pulse = modelPulse.get(model) || { failures: 0, lastFailure: 0 };
    pulse.failures++;
    pulse.lastFailure = Date.now();
    modelPulse.set(model, pulse);
  }
}

  async function getAICompletion(prompt: string, isJson: boolean = false, image?: string) {
    const AI_TIMEOUT = 50000;
    const errors: string[] = [];

    // 1. TEXT PRIORITY: Groq Instant
    if (!image) {
      const groqClient = getGroqClient();
      if (groqClient && isModelStable("groq-instant")) {
        try {
          console.log("🚀 NEURAL_LINK: Routing to Groq Instant...");
          const chatCompletion = await withTimeout(groqClient.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            max_tokens: 1024,
            response_format: isJson ? { type: "json_object" } : undefined
          }), 15000); 

          const res = chatCompletion.choices[0]?.message?.content;
          if (res) {
            recordModelStatus("groq-instant", true);
            return res;
          }
        } catch (e: any) {
           recordModelStatus("groq-instant", false);
           errors.push(`Groq: ${e.message}`);
        }
      }
    }

    // 2. VISION/BACKUP PRIORITY: OpenRouter (GPT-4o)
    const orKey = (process.env.OPENROUTER_API_KEY || "").trim();
    if (orKey && orKey.length > 10 && orKey !== 'placeholder') {
      const models = image ? ["openai/gpt-4o", "openai/gpt-4o-mini"] : ["openai/gpt-4o-mini", "meta-llama/llama-3.1-70b-instruct"];
      
      for (const model of models) {
        if (!isModelStable(`or-${model}`)) continue;
        try {
          console.log(`🚀 NEURAL_LINK: Routing to OpenRouter ${model}...`);
          let messages: any[] = [];
          if (image) {
            const cleanImage = image.trim().replace(/\r?\n|\r/g, "");
            messages = [{
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: cleanImage.startsWith("data:") ? cleanImage : `data:image/jpeg;base64,${cleanImage}`
                  }
                }
              ]
            }];
          } else {
            messages = [{ role: "user", content: prompt }];
          }

          const response = await withTimeout(fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${orKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://nerroplay.online",
              "X-Title": "NERROPLAY_ACTIVE_MODELS"
            },
            body: JSON.stringify({
              model,
              messages,
              max_tokens: 1500,
              response_format: isJson ? { type: "json_object" } : undefined
            }),
          }), AI_TIMEOUT);

          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(`OR_HTTP_${response.status}: ${data.error?.message || response.statusText}`);

          if (data.choices?.[0]?.message?.content) {
            recordModelStatus(`or-${model}`, true);
            return data.choices[0].message.content;
          }
        } catch (e: any) {
          recordModelStatus(`or-${model}`, false);
          errors.push(`OR_${model}: ${e.message}`);
        }
      }
    }

    // 3. ULTIMATE FALLBACK: Hugging Face
    const hfClient = getHFClient();
    if (hfClient && isModelStable("hf-fallback")) {
      try {
        console.log("🚀 NEURAL_LINK: Routing to Hugging Face Fallback...");
        const hfResponse = await withTimeout(hfClient.chatCompletion({
          model: "meta-llama/Llama-3.2-11B-Vision-Instruct", // Vision capable fallback
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024
        }), 20000);
        
        if (hfResponse.choices[0]?.message?.content) {
          recordModelStatus("hf-fallback", true);
          return hfResponse.choices[0].message.content;
        }
      } catch (e: any) {
        recordModelStatus("hf-fallback", false);
        errors.push(`HF_Fallback: ${e.message}`);
      }
    }

    throw new Error(`SYSTEM_CRITICAL_AI_FAILURE: All neural links severed. [Diagnostics: ${errors.join(' | ')}]`);
  }

  async function getAIStream(res: any, userMessage: string, systemInstruction: string, chatHistory: any[] = [], image?: string) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const errors: string[] = [];

    // 1. VISION/BACKUP PRIORITY: OpenRouter if image is provided
    const orKey = (process.env.OPENROUTER_API_KEY || "").trim();
    if (image && orKey && orKey.length > 10 && orKey !== 'placeholder') {
      try {
        console.log("🚀 STREAM_LINK: Routing to OpenRouter Vision (GPT-4o)...");
        const cleanImage = image.trim().replace(/\r?\n|\r/g, "");
        const imageUrl = cleanImage.startsWith("data:") ? cleanImage : `data:image/jpeg;base64,${cleanImage}`;

        const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${orKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nerroplay.online",
            "X-Title": "NERRO_ASTRO_STREAM_VISION"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o",
            messages: [
              { role: "system", content: systemInstruction },
              ...chatHistory.map(m => ({ role: m.role === 'nerro' ? 'assistant' : 'user', content: m.content })),
              {
                role: "user",
                content: [
                  { type: "text", text: userMessage },
                  { type: "image_url", image_url: { url: imageUrl } }
                ]
              }
            ],
            stream: true,
          }),
        });

        if (orResponse.ok && orResponse.body) {
          const reader = orResponse.body.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.choices[0]?.delta?.content || "";
                  if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
                } catch (e) {}
              }
            }
          }
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }
      } catch (e: any) {
        errors.push(`ORStreamVision: ${e.message}`);
        console.error("OpenRouter Stream Vision Error:", e);
      }
    }

    // 2. Groq (Primary for Text)
    if (!image) {
      const groqClient = getGroqClient();
      if (groqClient) {
        try {
          console.log("🚀 STREAM_LINK: Routing to Groq Instant...");
          const stream = await groqClient.chat.completions.create({
            messages: [
              { role: "system" as const, content: systemInstruction },
              ...chatHistory.map(m => ({ 
                role: (m.role === 'nerro' ? 'assistant' : 'user') as "assistant" | "user", 
                content: m.content 
              })),
              { role: "user" as const, content: userMessage }
            ],
            model: "llama-3.1-8b-instant",
            stream: true,
          });

          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        } catch (e: any) {
          errors.push(`GroqStream: ${e.message}`);
          console.error("Groq Stream Error:", e);
        }
      }
    }

    // 3. OpenRouter (Secondary Backup / Text Fallback)
    if (orKey && orKey.length > 10 && orKey !== 'placeholder') {
      try {
        console.log("🚀 STREAM_LINK: Routing to OpenRouter (GPT-4o-mini)...");
        const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${orKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nerroplay.online",
            "X-Title": "NERRO_ASTRO_STREAM"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              { role: "system", content: systemInstruction },
              ...chatHistory.map(m => ({ role: m.role === 'nerro' ? 'assistant' : 'user', content: m.content })),
              { role: "user", content: userMessage }
            ],
            stream: true,
          }),
        });

        if (orResponse.ok && orResponse.body) {
          const reader = orResponse.body.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.choices[0]?.delta?.content || "";
                  if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
                } catch (e) {}
              }
            }
          }
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }
      } catch (e: any) {
        errors.push(`ORStream: ${e.message}`);
        console.error("OpenRouter Stream Error:", e);
      }
    }

    // 3. Hugging Face (Ultimate Fallback)
    const hfClient = getHFClient();
    if (hfClient) {
      try {
        console.log("🚀 STREAM_LINK: Routing to Hugging Face Fallback...");
        const hfStream = hfClient.chatCompletionStream({
          model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
          messages: [
            { role: "system", content: systemInstruction },
            ...chatHistory.map(m => ({ role: m.role === 'nerro' ? 'assistant' : 'user', content: m.content })),
            { role: "user", content: userMessage }
          ],
          max_tokens: 1024
        });

        for await (const chunk of hfStream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      } catch (e: any) {
        errors.push(`HFStream: ${e.message}`);
        console.error("Hugging Face Stream Error:", e);
      }
    }

    res.write(`data: ${JSON.stringify({ error: "Interruption in the cosmic link. Diagnostics: " + errors.join(", ") })}\n\n`);
    res.end();
  }

  function safeJsonParse(content: string) {
    if (!content) throw new Error("EMPTY_OR_NULL_AI_RESPONSE");

    const cleaned = content.trim();
    
    try {
      // 1. Direct parse (fastest)
      return JSON.parse(cleaned);
    } catch (e) {
      // 2. Clear common markers: ```json [content] ```
      let stage2 = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
      try { return JSON.parse(stage2); } catch (e2) {}

      // 3. Regex Extract: Find the first { and last }
      try {
        const firstBracket = cleaned.indexOf('{');
        const lastBracket = cleaned.lastIndexOf('}');
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
          const extracted = cleaned.substring(firstBracket, lastBracket + 1);
          return JSON.parse(extracted);
        }
      } catch (e3) {
        console.error("AI_JSON_PARSE_CRITICAL_FAILURE:", cleaned);
        throw new Error(`NEURAL_SYNTAX_ERROR: AI generated invalid data structure.`);
      }
    }
    throw new Error("NEURAL_PARSING_FAULT: Interface could not extract valid parameters.");
  }

  app.post("/api/ai/analyze", async (req, res) => {
    const { toolName, tool, data: wrappedData, input, ...rest } = req.body;
    const finalData = wrappedData || input || rest;
    try {
      const toolToUse = toolName || tool || "Personalized Tool";
      const toolLower = toolToUse.toLowerCase();
      
      let specificInstructions = "";
      if (toolLower.includes('finance') || toolLower.includes('loan') || toolLower.includes('sip') || toolLower.includes('profit') || toolLower.includes('salary') || toolLower.includes('gst')) {
        specificInstructions = "This is a Finance & Investment tool. Focus on capital efficiency, risk management, and long-term financial strategy. Do not mention health or astrology.";
      } else if (toolLower.includes('health') || toolLower.includes('bmi') || toolLower.includes('water') || toolLower.includes('bmr') || toolLower.includes('calorie') || toolLower.includes('heart') || toolLower.includes('protein')) {
        specificInstructions = "This is a Health & Physiological tool. Focus exclusively on metabolic markers, physical optimization, and scientific health advice. STRICTLY FORBIDDEN: Do not mention spiritual, astrological, or Kundli related information. Only provide hydration/health insights.";
      } else if (toolLower.includes('astrology') || toolLower.includes('kundli') || toolLower.includes('horoscope')) {
        specificInstructions = "This is an Astrology/Kundli tool. Use a professional Vedic Astrologer tone. Focus on planetary influences, life purpose, and actionable remedies. Do not cross-over into clinical medical advice.";
      }

      const prompt = `Advanced Deep Analysis for ${toolToUse}. 
      User Input & Data: ${JSON.stringify(finalData)}. 
      
      Instructions:
      1. Provide a comprehensive, professional breakdown in Markdown format.
      2. ${specificInstructions}
      3. Be highly specific to the data provided. Do not use generic filler text.
      4. Ensure the tone is elite, technical, yet accessible.
      5. STRICT: Stay strictly within the scope of ${toolToUse}. Do not mention unrelated domains.`;
      
      const content = await getAICompletion(prompt, false);
      res.json({ analysis: content });
    } catch (error) {
      console.error("AI/Analyze Error:", error);
      res.status(500).json({ error: "Analysis failed", message: error instanceof Error ? error.message : "Internal Error" });
    }
  });

  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, isJson, image } = req.body;
    try {
      const content = await getAICompletion(prompt, !!isJson, image);
      if (isJson) {
        res.json(safeJsonParse(content));
      } else {
        res.json({ content });
      }
    } catch (error) {
      console.error("AI Generate Error:", error);
      res.status(500).json({ 
        error: "Neural link failed", 
        message: error instanceof Error ? error.message : "Internal Error" 
      });
    }
  });

  app.post("/api/ai/nerro-health", async (req, res) => {
    const { prompt } = req.body;
    try {
      const content = await getAICompletion(prompt, true);
      res.json(safeJsonParse(content));
    } catch (error) {
      console.error("NERRO Health AI Error:", error);
      res.status(500).json({ 
        error: "Neural Oracle Link Severed", 
        message: error instanceof Error ? error.message : "Internal Error" 
      });
    }
  });

  app.post("/api/ai/nerro-astro-chat", async (req, res) => {
    const { userMessage, astrologyContext, chatHistory, image } = req.body;
    
    if (!userMessage || !astrologyContext) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const systemInstruction = buildNerroAstroPrompt(astrologyContext);
      await getAIStream(res, userMessage, systemInstruction, chatHistory, image);
    } catch (error) {
      console.error("NERRO Astro Chat Error:", error);
      if (!res.headersSent) {
          res.status(500).json({ error: "Interruption in the cosmic link..." });
      }
    }
  });

  app.post("/api/tool/execute", async (req, res) => {
    const { toolId, inputData, skipAnalysis } = req.body;
    try {
      const handler = ToolHandlers[toolId];
      if (!handler) return res.status(404).json({ error: "No handler" });
      
      const { result, prompt } = handler(inputData);
      
      let analysis = null;
      if (prompt && !skipAnalysis) {
        try {
          analysis = await getAICompletion(prompt, false);
        } catch (aiError) {
          console.error(`AI Analysis failed for tool ${toolId}:`, aiError);
        }
      }
      
      res.json({ 
        ...result,
        analysis,
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      console.error(`Tool error [${toolId}]:`, error);
      res.status(500).json({ error: "Tool execution failed" });
    }
  });

  app.post("/api/analyze_face", async (req, res) => {
    const { image } = req.body;
    try {
      const prompt = `Analyze face meticulously. Return JSON: { "score": number, "glowUp": number, "faceShape": string, "skinTone": string, "undertone": string, "confidence": number, "summarizedAnalysis": string, "features": { "skin": string, "eyes": string, "jawline": string }, "suggestions": { "hair": string[], "skin": string[], "style": string[] }, "improvementPlan": string[] }.`;
      
      const content = await getAICompletion(prompt, true, image);
      res.json(safeJsonParse(content));
    } catch (error) {
      console.error("Face Analysis Error:", error);
      res.status(500).json({ 
        error: "Facial analysis failed", 
        message: error instanceof Error ? error.message : "Facial analysis failed" 
      });
    }
  });

  app.post("/api/men_styler", async (req, res) => {
    const { image, occasion, styleMode } = req.body;
    try {
      const prompt = `Analyze Men Style for ${occasion} (${styleMode}). Return JSON: {
        "score": number,
        "glowUp": number,
        "faceShape": string,
        "skinTone": string,
        "hair": {
           "style": string,
           "beard": string,
           "fadeType": string,
           "searchQueries": { "hair": string, "beard": string }
        },
        "outfit": {
           "top": string,
           "bottom": string,
           "shoes": string,
           "completeLook": string,
           "searchQueries": { "outfit": string }
        },
        "colorMatch": { "best": string[], "avoid": string[], "palette": string },
        "groomingTips": string[],
        "brands": string[]
      }`;
      
      const content = await getAICompletion(prompt, true, image);
      res.json(safeJsonParse(content));
    } catch (error) {
      console.error("MenStyler error:", error);
      res.status(500).json({ 
        error: "Style analysis failed", 
        message: error instanceof Error ? error.message : "Style AI returned an invalid data format." 
      });
    }
  });

  app.post("/api/fashion_styler", async (req, res) => {
    const { image, occasion, styleMode } = req.body;
    try {
      const prompt = `Analyze Fashion for ${occasion} (${styleMode}). Return JSON: {
        "score": number,
        "glowUp": number,
        "faceShape": string,
        "skinTone": string,
        "nails": { "colors": string[], "designs": string[] },
        "makeup": { "lipstick": string[], "foundation": string, "eye": string[] },
        "outfit": { "colors": string[], "innerWear": string[], "outdoor": string[], "occasionWear": string[] },
        "colorMatch": { "best": string[], "avoid": string[] },
        "brands": { "nail": string[], "lipstick": string[], "fashion": string[] }
      }`;
      
      const content = await getAICompletion(prompt, true, image);
      res.json(safeJsonParse(content));
    } catch (error) {
      console.error("FashionStyler error:", error);
      res.status(500).json({ 
        error: "Fashion analysis failed", 
        message: error instanceof Error ? error.message : "Fashion AI returned an invalid data format." 
      });
    }
  });

  app.post("/api/ac/analyze", async (req, res) => {
    const { image_provided, manual_data, recommendation_requested, image } = req.body;
    try {
      // 1. Fetch real AC products from Supabase if available
      let dbProducts = [];
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin.from('ac_products').select('*').limit(20);
        if (!error && data) {
          dbProducts = data;
        }
      }

      const prompt = `You are NerroPlay's AC Intelligence Expert, India's smartest air conditioner advisor.
Analyze the provided AC energy label image (if provided) and merge with manual inputs.

INPUT CONTEXT:
image_provided: ${image_provided}
manual_data: ${JSON.stringify(manual_data)}
recommendation_requested: ${recommendation_requested}

Available Real AC Library (Priority Picks):
${dbProducts.length > 0 ? JSON.stringify(dbProducts) : "No library data - use standard India market models"}

---
🔹 STEP 1: IMAGE ANALYSIS (IF PROVIDED)
From BEE India label: extract Number of stars (1-5), ISEER/EER value, Cooling capacity (Watts/Tonnage), Brand, Model, Annual energy consumption (kWh).

🔹 STEP 2: BILL CALCULATION (CORE LOGIC)
If tonnage is not extracted, use room_size: 
- <120 sqft: 0.75T-1T
- 120-150 sqft: 1T
- 150-180 sqft: 1.2T
- 180-240 sqft: 1.5T
- 240+ sqft: 2T

Formulas:
- Non-Inverter AC: Power (kW) = Tonnage × 1.2
- Inverter AC: Power (kW) = Tonnage × 0.7
- Monthly Units = Power × Daily Hours × 30
- Multiplier (Star Effect): 1★(1.0), 2★(0.92), 3★(0.84), 4★(0.76), 5★(0.68)
Apply multiplier to Monthly Units.
- Monthly Bill = Monthly Units × Rate

🔹 STEP 3: COMPARISON TABLE DATA
Create a comparison for Current vs Budget(3*), Best Value(4*), Premium(5*). 
All comparison models must be Inverter Split ACs.

🔹 STEP 4: RECOMMENDATIONS (INDIA MARKET)
- Priority: If "Available Real AC Library" is provided, pick the most suitable models from it.
- Otherwise use:
  - Budget under ₹30k: Voltas, Lloyd, Haier, Godrej
  - Popular/Editor Choice ₹30k-45k: LG, Samsung, Blue Star, Carrier, Panasonic
  - Premium ₹45k+: Daikin, Hitachi, O General, Mitsubishi

Tone: Hinglish (Hindi + English), informative yet catchy.

---
RETURN STRICT JSON:
{
  "detected_data": { 
    "star_rating": number, 
    "iseer": number, 
    "annual_units": number, 
    "ac_type": "Inverter" | "Non-Inverter", 
    "brand": string,
    "tonnage": number 
  },
  "calculation": { 
    "daily_units": number,
    "monthly_units": number, 
    "monthly_bill": number,
    "annual_bill": number
  },
  "comparison": [
    { "option": "Current AC", "star": string, "type": string, "monthly_bill": number, "annual_savings": 0 },
    { "option": "Budget Pick", "star": "3★", "type": "Inverter", "monthly_bill": number, "annual_savings": number },
    { "option": "Best Value", "star": "4★", "type": "Inverter", "monthly_bill": number, "annual_savings": number },
    { "option": "Premium Pick", "star": "5★", "type": "Inverter", "monthly_bill": number, "annual_savings": number }
  ],
  "recommendations": [
    { 
      "category": "Budget Pick" | "Editor's Choice" | "Premium Pick",
      "model_name": string, 
      "brand": string, 
      "star_rating": number, 
      "tonnage": number,
      "approx_price": string, 
      "why_buy": string,
      "amazon_link": string,
      "payback_years": number
    }
  ],
  "tonnage_advice": string,
  "smart_tips": string[]
}`;

      const content = await getAICompletion(prompt, true, image);
      res.json(safeJsonParse(content));
    } catch (error) {
      console.error("AC Analyze Error:", error);
      res.status(500).json({ error: "Failed to analyze AC", message: error instanceof Error ? error.message : "Internal Error" });
    }
  });


  app.post("/api/share", (req, res) => {
    const { tool, results } = req.body;
    // In a real app, we might save this to a DB and return an ID
    // For now, we'll return a link to the main site with params
    const baseUrl = "https://nerroplay.online";
    const shareUrl = `${baseUrl}?tool=${encodeURIComponent(tool)}&shared=true`;
    res.json({ shareUrl });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  // GLOBAL ERROR HANDLER
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('SERVER_ERROR:', err);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  });

  if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  
  return app;
}

export default startServer();
