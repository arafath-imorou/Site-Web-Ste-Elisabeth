-- ==========================================
-- SET NOBLESSE ROOM TO AVAILABLE
-- ==========================================

UPDATE public.rooms 
SET is_available = true 
WHERE name = 'Noblesse';

-- Verification
-- SELECT name, is_available FROM public.rooms WHERE name = 'Noblesse';
