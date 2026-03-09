-- ==========================================================
-- REQUÊTE SQL POUR CLÔTURER LE SÉJOUR ACTUEL (M. ABDOULAYE)
-- ==========================================================
-- NOTE : J'ai mis à jour ce fichier avec les VRAIS identifiants.
-- Vous pouvez copier-coller tout ce bloc dans l'éditeur SQL de Supabase.

BEGIN;
  -- 1. Marquer le séjour de M. ABDOULAYE comme terminé
  UPDATE public.stays 
  SET status = 'completed', 
      real_check_out = CURRENT_DATE 
  WHERE id = '6297961d-e0c8-4f1d-b480-6c3a4c7f4cc4';

  -- 2. Libérer la chambre "Tranquilité"
  UPDATE public.rooms 
  SET is_available = true 
  WHERE id = 'ef604255-72ca-4c38-8cdc-e6b2ca014698';

  -- 3. Ajouter les points de fidélité au client
  UPDATE public.clients 
  SET loyalty_points = COALESCE(loyalty_points, 0) + (
    SELECT GREATEST(1, (CURRENT_DATE - check_in)) * 20
    FROM public.stays 
    WHERE id = '6297961d-e0c8-4f1d-b480-6c3a4c7f4cc4'
  )
  WHERE id = 'ff78f341-b673-44d8-a5f1-13a2b273924a';
COMMIT;


-- ==========================================================
-- POUR LES PROCHAINS SÉJOURS (SI BESOIN)
-- ==========================================================
-- Étape A : Exécutez cette ligne pour voir les IDs des séjours en cours :
-- SELECT s.id as stay_id, s.room_id, s.client_id, c.last_name, r.name as room_name FROM stays s JOIN clients c ON s.client_id = c.id JOIN rooms r ON s.room_id = r.id WHERE s.status = 'active';

-- Étape B : Copiez les IDs dans la requête de clôture ci-dessus.
