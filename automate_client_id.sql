-- 1. Create sequences for each site if they don't exist
CREATE SEQUENCE IF NOT EXISTS public.client_abc_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.client_ald_seq START 1;

-- 2. Add site column to clients table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'site') THEN
        ALTER TABLE public.clients ADD COLUMN site TEXT;
    END IF;
END $$;

-- 3. Create the function to generate the unique ID format: SDF/{SITE}/{N°d'ordre}/{année}
CREATE OR REPLACE FUNCTION public.generate_client_unique_id()
RETURNS trigger AS $$
DECLARE
    next_val INTEGER;
    current_year TEXT;
    site_code TEXT;
    seq_name TEXT;
BEGIN
    -- Only generate if unique_client_id is NULL or empty
    IF NEW.unique_client_id IS NULL OR NEW.unique_client_id = '' THEN
        -- Get the current year
        current_year := to_char(CURRENT_DATE, 'YYYY');
        
        -- Determine site code and sequence
        IF NEW.site = 'Abomey-Calavi' THEN
            site_code := 'ABC';
            seq_name := 'public.client_abc_seq';
        ELSIF NEW.site = 'Allada' THEN
            site_code := 'ALD';
            seq_name := 'public.client_ald_seq';
        ELSE
            -- Default to ABC if not specified (though it should be mandatory in UI)
            site_code := 'ABC';
            seq_name := 'public.client_abc_seq';
        END IF;

        -- Get the next value from the appropriate sequence
        EXECUTE format('SELECT nextval(%L)', seq_name) INTO next_val;
        
        -- Format: SDF/{SITE}/{4 digits}/{Year}
        -- Example: SDF/ALD/0001/2026
        NEW.unique_client_id := 'SDF/' || site_code || '/' || lpad(next_val::text, 4, '0') || '/' || current_year;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the trigger to set the unique ID before insert
DROP TRIGGER IF EXISTS trigger_set_client_unique_id ON public.clients;
CREATE TRIGGER trigger_set_client_unique_id
BEFORE INSERT ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.generate_client_unique_id();

-- 4. (Optional) Set the sequence to start after existing clients if any
-- Since the table was empty in previous checks, we start at 1.
-- If there were clients, we would do:
-- SELECT setval('public.client_order_seq', COALESCE((SELECT max(substring(unique_client_id from 4 for 4)::int) FROM public.clients), 0) + 1);
