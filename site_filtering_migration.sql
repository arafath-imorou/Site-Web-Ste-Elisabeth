-- Migration: Site-based filtering for receptionist profiles and clients

-- 1. Ensure 'site' column exists in profiles (already used in frontend, but good to ensure)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'site') THEN
        ALTER TABLE profiles ADD COLUMN site TEXT CHECK (site IN ('Abomey-Calavi', 'Allada'));
    END IF;
END $$;

-- 2. Update existing profiles based on email
UPDATE profiles 
SET site = 'Abomey-Calavi' 
WHERE email = 'receptioncalavi@steelisabethhouse.com';

UPDATE profiles 
SET site = 'Allada' 
WHERE email = 'receptionallada@steelisabethhouse.com';

-- 3. Update the handle_new_user trigger to include site
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, site)
  VALUES (
    new.id, 
    new.email, 
    CASE 
      WHEN new.email IN ('admin@steelisabethhotel.com', 'dohounnonjaures@gmail.com') THEN 'admin'
      WHEN new.email IN ('receptioncalavi@steelisabethhouse.com', 'receptionallada@steelisabethhouse.com') THEN 'reception'
      ELSE 'reception'
    END,
    CASE
      WHEN new.email = 'receptioncalavi@steelisabethhouse.com' THEN 'Abomey-Calavi'
      WHEN new.email = 'receptionallada@steelisabethhouse.com' THEN 'Allada'
      ELSE NULL
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ensure RLS policies for clients table
-- Drop existing public policy if it's too permissive
DROP POLICY IF EXISTS "Public Read Clients" ON clients;

-- Policy for Public (maybe keep it if anonymous users need to see something? usually not for hotel management)
-- For now, let's keep it restricted to authenticated users or specific roles

-- Admin Policy: Full Access
DROP POLICY IF EXISTS "Admin Full Access Clients 1" ON clients;
DROP POLICY IF EXISTS "Admin Full Access Clients 2" ON clients;
-- The schema uses a loop for admins, so let's stick to the current pattern if possible, 
-- or just add a generic one for authenticated admin role.

-- Reception Policy: Filtered by Site
DROP POLICY IF EXISTS "Reception Access clients" ON clients;
CREATE POLICY "Reception Access clients" ON clients
FOR ALL TO authenticated
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR 
    (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'reception'
        AND 
        site = (SELECT site FROM profiles WHERE id = auth.uid())
    )
)
WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR 
    (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'reception'
        AND 
        site = (SELECT site FROM profiles WHERE id = auth.uid())
    )
);

-- 5. Backfill site for existing clients if possible (optional, based on their stays)
-- This is tricky if a client stayed in both, but usually we mark them by their first stay or registration site.
UPDATE clients
SET site = s.site
FROM stays s
WHERE clients.id = s.client_id
AND clients.site IS NULL;
