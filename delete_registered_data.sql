-- ==========================================
-- DELETE ALL CLIENTS AND RESERVATIONS
-- ==========================================

-- 1. Delete all reservations
-- This table does not have a foreign key to clients, but contains booking data.
DELETE FROM public.reservations;

-- 2. Delete all clients
-- This will automatically delete all entries in the 'stays' table 
-- because of the ON DELETE CASCADE constraint on stays.client_id.
DELETE FROM public.clients;

-- Verification queries (can be run after to confirm)
-- SELECT count(*) FROM public.clients;
-- SELECT count(*) FROM public.stays;
-- SELECT count(*) FROM public.reservations;
