-- Setup for AC Products table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.ac_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    brand TEXT NOT NULL,
    model_name TEXT NOT NULL,
    star_rating INTEGER NOT NULL,
    tonnage NUMERIC NOT NULL,
    approx_price NUMERIC NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Budget Pick', 'Editor's Choice', 'Premium Pick'
    why_buy TEXT,
    amazon_link TEXT,
    payback_years NUMERIC,
    iseer NUMERIC
);

-- Seed data for testing
INSERT INTO public.ac_products (brand, model_name, star_rating, tonnage, approx_price, category, why_buy, amazon_link, payback_years, iseer)
VALUES 
('LG', 'LG 1.5 Ton 5 Star AI+ Dual Inverter Split AC', 5, 1.5, 46990, 'Premium Pick', 'Best-in-class energy efficiency with AI convertible 6-in-1 cooling.', 'https://amazon.in/dp/B0CP27LD2N', 2.5, 5.23),
('Voltas', 'Voltas 1.4 Ton 3 Star Inverter Split AC', 3, 1.4, 32990, 'Budget Pick', 'Reliable cooling even at 52°C, very popular in India for budget segments.', 'https://amazon.in/dp/B0CPB5L3VZ', 4, 3.81),
('Panasonic', 'Panasonic 1.5 Ton 5 Star Wi-Fi Inverter Split AC', 5, 1.5, 44990, 'Editor''s Choice', 'MirAIe app support and nanoe-G technology for clean air.', 'https://amazon.in/dp/B0CP9P3X64', 3, 5.1),
('Lloyd', 'Lloyd 1.5 Ton 3 Star Inverter Split AC', 3, 1.5, 33490, 'Budget Pick', 'Hidden LED display and elegant design at an affordable price.', 'https://amazon.in/dp/B0CQ7C27Q4', 4.2, 3.75),
('Daikin', 'Daikin 1.5 Ton 5 Star Inverter Split AC', 5, 1.5, 45490, 'Premium Pick', 'Triple Display and Dew Clean Technology for pure air.', 'https://amazon.in/dp/B0CP9M9H7J', 2.8, 5.2);
