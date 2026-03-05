-- ==========================================
-- FIX ADMIN ROLES & ACCESS LEVELS
-- ==========================================

-- 1. CLEANUP & ALIGN PROFILES
TRUNCATE public.profiles;

INSERT INTO public.profiles (id, email, role)
SELECT id, email, 
    CASE 
        WHEN email IN ('admin@steelisabethhotel.com', 'dohounnonjaures@gmail.com') THEN 'admin'
        WHEN email IN ('receptioncalavi@steelisabethhotel.com', 'receptionallada@steelisabethhotel.com') THEN 'reception'
        ELSE 'reception'
    END as role
FROM auth.users
WHERE email IN (
    'admin@steelisabethhotel.com', 
    'dohounnonjaures@gmail.com', 
    'receptioncalavi@steelisabethhotel.com', 
    'receptionallada@steelisabethhotel.com'
);

-- 2. UPDATE AUTH TRIGGER
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
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ENFORCE RLS POLICIES

-- Drop existing complex policies to avoid conflicts
DROP POLICY IF EXISTS "Admin Full Access Settings 1" ON site_settings;
DROP POLICY IF EXISTS "Admin Full Access Settings 2" ON site_settings;
DROP POLICY IF EXISTS "Admin Full Access Gallery 1" ON gallery;
DROP POLICY IF EXISTS "Admin Full Access Gallery 2" ON gallery;

-- Global Admin Access (Full)
DO $$
DECLARE
    all_tables TEXT[] := ARRAY['rooms', 'room_images', 'gallery', 'services', 'offers', 'site_settings', 'profiles', 'clients', 'stays', 'reservations', 'contacts'];
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(all_tables)
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Admin Access %s" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Admin Access %s" ON %I FOR ALL TO authenticated 
            USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''admin''))
            WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''admin''))', t, t);
    END LOOP;
END $$;

-- Global Reception Access (Limited)
-- Reception can manage stays, reservations, and clients.
-- Reception can READ everything else but not MODIFY.
DO $$
DECLARE
    manage_tables TEXT[] := ARRAY['reservations', 'clients', 'stays'];
    read_only_tables TEXT[] := ARRAY['rooms', 'room_images', 'gallery', 'services', 'offers', 'site_settings'];
    t TEXT;
BEGIN
    -- Tables they can MANAGE
    FOR t IN SELECT unnest(manage_tables)
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Reception Manage %s" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Reception Manage %s" ON %I FOR ALL TO authenticated 
            USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''reception''))
            WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''reception''))', t, t);
    END LOOP;

    -- Tables they can only READ
    FOR t IN SELECT unnest(read_only_tables)
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Reception Read %s" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Reception Read %s" ON %I FOR SELECT TO authenticated 
            USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''reception''))', t, t);
    END LOOP;
END $$;
