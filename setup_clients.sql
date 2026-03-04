-- Drop existing table if it exists to easily recreate with new schema (CAUTION: wipes data)
-- If keeping data is required, use ALTER TABLE instead.
DROP TABLE IF EXISTS public.clients;

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unique_client_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    maiden_name TEXT,
    birth_date DATE,
    birth_place TEXT,
    department TEXT,
    country TEXT,
    profession TEXT,
    usual_residence TEXT,
    nationality TEXT,
    id_type TEXT, -- e.g., Passport, CNI, Permis de conduire
    id_number TEXT,
    id_issue_date DATE,
    id_expiry_date DATE,
    id_issue_place TEXT,
    email TEXT,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to clients"
    ON public.clients FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert to clients"
    ON public.clients FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to clients"
    ON public.clients FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete to clients"
    ON public.clients FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create an index for faster lookups by unique_client_id
CREATE INDEX IF NOT EXISTS idx_clients_unique_id ON public.clients(unique_client_id);
