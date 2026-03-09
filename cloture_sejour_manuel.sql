-- REQUÊTE SQL POUR CLÔTURER UN SÉJOUR MANUELLEMENT
-- Instructions: Remplacez les valeurs STAY_ID, ROOM_ID et CLIENT_ID par les vraies valeurs.
-- La date '2026-03-09' doit être remplacée par la date de départ réelle.

BEGIN;
  -- 1. Marquer le séjour comme terminé et enregistrer la date de départ réelle
  UPDATE public.stays 
  SET status = 'completed', 
      real_check_out = '2026-03-09' -- DATE DE DÉPART RÉELLE
  WHERE id = 'STAY_ID'; -- ID DU SÉJOUR

  -- 2. Libérer la chambre
  UPDATE public.rooms 
  SET is_available = true 
  WHERE id = 'ROOM_ID'; -- ID DE LA CHAMBRE

  -- 3. Ajouter les points de fidélité au client (20 points par nuit)
  UPDATE public.clients 
  SET loyalty_points = COALESCE(loyalty_points, 0) + (
    SELECT GREATEST(1, ('2026-03-09'::date - check_in)) * 20
    FROM public.stays 
    WHERE id = 'STAY_ID'
  )
  WHERE id = (SELECT client_id FROM public.stays WHERE id = 'STAY_ID');
COMMIT;

-- POUR TROUVER LES IDS NÉCESSAIRES :
-- SELECT s.id as stay_id, s.room_id, s.client_id, c.last_name, r.name as room_name
-- FROM stays s
-- JOIN clients c ON s.client_id = c.id
-- JOIN rooms r ON s.room_id = r.id
-- WHERE s.status = 'active';
