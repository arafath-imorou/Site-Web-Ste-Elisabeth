-- ==========================================
-- FIX ADMIN ACCESS & SECURITY
-- ==========================================

-- 1. MISE À JOUR DES POLITIQUES DE SÉCURITÉ (RLS)
-- Cela garantit que SEUL admin@steelisabethhotel.com peut modifier les données.

DROP POLICY IF EXISTS "Admin Full Access Rooms" ON rooms;
CREATE POLICY "Admin Full Access Rooms" ON rooms FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

DROP POLICY IF EXISTS "Admin Full Access Services" ON services;
CREATE POLICY "Admin Full Access Services" ON services FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

DROP POLICY IF EXISTS "Admin Full Access Gallery" ON gallery;
CREATE POLICY "Admin Full Access Gallery" ON gallery FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

DROP POLICY IF EXISTS "Admin Full Access Reservations" ON reservations;
CREATE POLICY "Admin Full Access Reservations" ON reservations FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

DROP POLICY IF EXISTS "Admin Full Access Contacts" ON contacts;
CREATE POLICY "Admin Full Access Contacts" ON contacts FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

-- 2. "FIXATION" DE L'UTILISATEUR DANS LA BASE D'AUTH
-- Force la confirmation de l'email pour l'admin pour éviter les blocages.

UPDATE auth.users 
SET email_confirmed_at = now(), 
    last_sign_in_at = now()
WHERE email = 'admin@steelisabethhotel.com';

-- NOTE: Si vous n'avez pas encore créé l'utilisateur 'admin@steelisabethhotel.com' 
-- dans l'onglet Authentication -> Users de Supabase, faites-le d'abord !
