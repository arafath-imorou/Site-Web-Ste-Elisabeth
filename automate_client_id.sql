-- 1. Create a sequence for the client order number if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS public.client_order_seq START 1;

-- 2. Create the function to generate the unique ID format: SDF + N°d'ordre + /année
CREATE OR REPLACE FUNCTION public.generate_client_unique_id()
RETURNS trigger AS $$
DECLARE
    next_val INTEGER;
    current_year TEXT;
BEGIN
    -- Only generate if unique_client_id is NULL or empty
    IF NEW.unique_client_id IS NULL OR NEW.unique_client_id = '' THEN
        -- Get the next value from the sequence
        next_val := nextval('public.client_order_seq');
        
        -- Get the current year
        current_year := to_char(CURRENT_DATE, 'YYYY');
        
        -- Format: SDF + 4 digits (padded with 0) + / + Year
        -- Example: SDF0001/2026
        NEW.unique_client_id := 'SDF' || lpad(next_val::text, 4, '0') || '/' || current_year;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the trigger to set the unique ID before insert
DROP TRIGGER IF EXISTS trigger_set_client_unique_id ON public.clients;
CREATE TRIGGER trigger_set_client_unique_id
BEFORE INSERT ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.generate_client_unique_id();

-- 4. (Optional) Set the sequence to start after existing clients if any
-- Since the table was empty in previous checks, we start at 1.
-- If there were clients, we would do:
-- SELECT setval('public.client_order_seq', COALESCE((SELECT max(substring(unique_client_id from 4 for 4)::int) FROM public.clients), 0) + 1);
