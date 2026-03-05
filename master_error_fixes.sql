-- =====================================================================
-- SCRIPT COMPLET : CORRECTIONS STRUCTURELLES & ERREURS COURANTES
-- =====================================================================
-- Ce script rassemble toutes les corrections d'erreurs abordées 
-- précédemment. Il peut être exécuté en toute sécurité dans l'éditeur
-- SQL Supabase.
-- =====================================================================

-- 1. CORRECTION DES RÔLES ADMIN & TRIGGER AUTH
-- ---------------------------------------------------------------------
-- Supprime et recrée le trigger d'authentification pour attribuer 
-- correctement les rôles "admin" ou "reception" dès la création.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id, 
    new.email, 
    CASE 
      WHEN new.email IN ('admin@steelisabethhotel.com', 'dohounnonjaures@gmail.com') THEN 'admin'
      WHEN new.email LIKE 'reception%@steelisabethhotel.com' THEN 'reception'
      ELSE 'reception'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- S'assurer que les utilisateurs existants ont le bon rôle
UPDATE public.profiles 
SET role = CASE 
    WHEN email IN ('admin@steelisabethhotel.com', 'dohounnonjaures@gmail.com') THEN 'admin'
    WHEN email IN ('receptioncalavi@steelisabethhotel.com', 'receptionallada@steelisabethhotel.com') THEN 'reception'
    ELSE 'reception'
END;


-- 2. CORRECTION DE LA RÉCURSION INFINIE (RLS PROFILES)
-- ---------------------------------------------------------------------
-- Corrige l'erreur de boucle infinie sur la table profiles

DROP POLICY IF EXISTS "Public Profile Access" ON profiles;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Public Profile Access" ON profiles 
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);


-- 3. POLITIQUES D'ACCÈS GLOBALES (ADMIN VS RECEPTION)
-- ---------------------------------------------------------------------
-- Réinitialise les règles d'accès de manière sécurisée (Administrateurs ont tout, Réception est limité)

DO $$
DECLARE
    all_tables TEXT[] := ARRAY['rooms', 'room_images', 'gallery', 'services', 'offers', 'site_settings', 'clients', 'stays', 'reservations', 'contacts'];
    manage_tables TEXT[] := ARRAY['reservations', 'clients', 'stays'];
    read_only_tables TEXT[] := ARRAY['rooms', 'room_images', 'gallery', 'services', 'offers', 'site_settings'];
    t TEXT;
BEGIN
    -- Permissions Admin
    FOR t IN SELECT unnest(all_tables) LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Admin Access %s" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Admin Access %s" ON %I FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''admin''))', t, t);
    END LOOP;

    -- Permissions Réception (Lecture, Écriture pour les tables de gestion)
    FOR t IN SELECT unnest(manage_tables) LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Reception Manage %s" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Reception Manage %s" ON %I FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''reception''))', t, t);
    END LOOP;

    -- Permissions Réception (Lecture Seule pour le reste)
    FOR t IN SELECT unnest(read_only_tables) LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Reception Read %s" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Reception Read %s" ON %I FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''reception''))', t, t);
    END LOOP;
END $$;


-- 4. VÉRIFICATION DES COLONNES MANQUANTES
-- ---------------------------------------------------------------------
-- Ce bloc s'assure que toutes les colonnes nécessaires pour 
-- les formulaires d'enregistrement existent.

DO $$
BEGIN
    -- Table clients
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='birth_date') THEN
        ALTER TABLE clients ADD COLUMN birth_date date;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='id_number') THEN
        ALTER TABLE clients ADD COLUMN id_number text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='id_type') THEN
        ALTER TABLE clients ADD COLUMN id_type text DEFAULT 'CNI';
    END IF;

    -- Table stays
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='travel_reason') THEN
        ALTER TABLE stays ADD COLUMN travel_reason text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='transport_mode') THEN
        ALTER TABLE stays ADD COLUMN transport_mode text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='coming_from') THEN
        ALTER TABLE stays ADD COLUMN coming_from text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='going_to') THEN
        ALTER TABLE stays ADD COLUMN going_to text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='children_count') THEN
        ALTER TABLE stays ADD COLUMN children_count integer DEFAULT 0;
    END IF;
END $$;


-- 5. AUTOMATISATION DE L'ID CLIENT (SDF/XXXX/YEAR)
-- ---------------------------------------------------------------------
-- Garantie que l'identifiant unique se génère automatiquement sans crash.

CREATE OR REPLACE FUNCTION generate_client_id()
RETURNS TRIGGER AS $$
DECLARE
    current_year text;
    sequence_number int;
    formatted_sequence text;
BEGIN
    current_year := to_char(CURRENT_DATE, 'YY');
    -- Find highest sequence for current year
    SELECT COALESCE(
        MAX(
            CAST(SUBSTRING(unique_client_id FROM 5 FOR 4) AS INT)
        ), 0
    ) INTO sequence_number
    FROM clients
    WHERE unique_client_id LIKE 'SDF/%/' || current_year;
    
    sequence_number := sequence_number + 1;
    formatted_sequence := LPAD(sequence_number::text, 4, '0');
    -- Set the new ID
    NEW.unique_client_id := 'SDF/' || formatted_sequence || '/' || current_year;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_client_id ON clients;
CREATE TRIGGER trigger_generate_client_id
BEFORE INSERT ON clients
FOR EACH ROW
EXECUTE FUNCTION generate_client_id();

-- FIN DU SCRIPT
