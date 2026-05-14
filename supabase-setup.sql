
-- 1. Create the secrets table
CREATE TABLE IF NOT EXISTS public.secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.secrets ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy that only allows service_role to access (keep keys private)
-- Note: Your server.ts uses the service_role key, so this is safe.
CREATE POLICY "Service Role Only Access" 
ON public.secrets 
FOR ALL 
TO service_role 
USING (true);

-- 4. Sample Insert (Replace with actual keys if running manually)
-- INSERT INTO public.secrets (key, value) VALUES ('GROQ_API_KEY', 'your-key-here');
