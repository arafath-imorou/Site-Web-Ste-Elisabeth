-- Create the stays table
CREATE TABLE IF NOT EXISTS public.stays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id),
    site TEXT CHECK (site IN ('Abomey-Calavi', 'Allada')),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We use the existing rooms table. 
-- Assuming a client needs to be able to "checkout", which completes the stay.

-- Set up Row Level Security (RLS)
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to stays"
    ON public.stays FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert to stays"
    ON public.stays FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to stays"
    ON public.stays FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete to stays"
    ON public.stays FOR DELETE
    USING (auth.role() = 'authenticated');

-- Optional: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_stays_client_id ON public.stays(client_id);
CREATE INDEX IF NOT EXISTS idx_stays_status ON public.stays(status);
