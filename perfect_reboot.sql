-- ==========================================
-- PERFECT REBOOT (FULL DATABASE FIX)
-- ==========================================

-- 1. CLEANUP & SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS stays CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS room_images CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS about_content CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS restaurant_menus CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'reception')) DEFAULT 'reception',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity INTEGER NOT NULL,
    size_sqm INTEGER,
    amenities TEXT[],
    cancellation_policy TEXT,
    is_available BOOLEAN DEFAULT true,
    site TEXT CHECK (site IN ('Abomey-Calavi', 'Allada')) DEFAULT 'Abomey-Calavi',
    image TEXT,
    prices JSONB,
    order_index INTEGER DEFAULT 99,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE room_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unique_client_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id),
    site TEXT CHECK (site IN ('Abomey-Calavi', 'Allada')),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    travel_reason TEXT,
    transport_mode TEXT,
    age INTEGER,
    profession TEXT,
    occupation TEXT,
    phone TEXT,
    email TEXT
);

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests_count INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    site TEXT CHECK (site IN ('Abomey-Calavi', 'Allada')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage INTEGER,
    valid_until DATE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SEED DATA

-- ROOMS (Corrected Images & Order)
INSERT INTO rooms (id, name, description, price_per_night, capacity, site, amenities, image, prices, order_index) VALUES
('6fca1009-f4da-43dd-96e7-f60c3384a53f', 'Harmonie', 'Chambre Simple Ventillée', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur', 'Lit confortable', 'Vue sur jardin'], '/Images/CHAMBRE HARMONIE.jpg', '{"ventillee": 10500}', 1),
('6b6eebf7-0a16-4111-8606-d17f977d4ca0', 'Simplicité', 'Chambre Simple', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur', 'Vue verdure'], '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg', '{"ventillee": 10500, "climee": 12500}', 2),
('ef604255-72ca-4c38-8cdc-e6b2ca014698', 'Tranquilité', 'Chambre Simple', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur', 'Climatisation'], '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg', '{"ventillee": 10500, "climee": 12500}', 3),
('2bb80d2c-0d22-4a74-a766-45f799646765', 'Douceur', 'Chambre Salon avec Balcon sur Jardin', 20500, 3, 'Abomey-Calavi', ARRAY['Cuisine équipée', 'Balcon Privé', 'Espace Vert'], '/Images/CHAMBRE DOUCEUR.jpg', '{"ventillee": 20500, "climee": 26500}', 4),
('bd3ffe3f-7c18-4feb-ac73-dc0eeea9bc0a', 'Noblesse', '2 chambres salon meublées, cuisine, douche et balcon', 31500, 4, 'Abomey-Calavi', ARRAY['Cuisine équipée', 'Balcon', 'Grand Salon'], '/Images/SUITE NOBLESSE.jpg', '{"ventillee": 31500, "climee": 41500}', 5),
('bdb204df-25be-41c1-9fa8-206926f69140', 'Salle de Conférence', 'Equipement de Sonorisation (50 à 70 places)', 50000, 70, 'Abomey-Calavi', ARRAY['Sonorisation', 'Sièges confortables', 'Vidéoprojecteur'], '/Images/SALLE DE CONFERENCE.jpg', '{"ventillee": 50000, "climee": 70000}', 6),
('39c29c02-c34c-4322-9fde-fe5b4f34db15', 'Chambre Standard (2 places)', 'Ventillée, Lit 2 places', 5500, 2, 'Allada', ARRAY['Ventilateur', 'Lit 2 places'], '/Images/CHAMBRE ALLADA 2.jpg', null, 1),
('7038fcae-edf5-4d4e-9a90-742a18cd9e44', 'Chambre Standard (3 places)', 'Ventillée, Lit 3 places', 8000, 3, 'Allada', ARRAY['Ventilateur', 'Lit 3 places'], '/Images/CAHMBRE ALLADA.jpg', null, 2),
('b7af59e5-3d95-4176-8051-f2670bc45234', 'Chambre Climée', 'Climée, Lit 3 places', 10500, 3, 'Allada', ARRAY['Climatisation', 'Lit 3 places'], '/Images/CHAMBRE ALLADA 3.jpg', null, 3);

INSERT INTO room_images (room_id, url) VALUES
('bd3ffe3f-7c18-4feb-ac73-dc0eeea9bc0a', '/Images/SUITE NOBLESSE 3.jpg'),
('bd3ffe3f-7c18-4feb-ac73-dc0eeea9bc0a', '/Images/SUITE NOBLESSE 4.jpg'),
('bd3ffe3f-7c18-4feb-ac73-dc0eeea9bc0a', '/Images/SUITE NOBLESSE 5.jpg');

INSERT INTO services (name, description, icon) VALUES
('Restaurant Gastronomique', 'Une cuisine raffinée préparée par nos chefs étoilés.', 'Coffee'),
('Jardins & Promenade', 'Découvrez nos espaces verts et nos jardins tropicaux.', 'Sparkles'),
('Espace Détente', 'Un cadre naturel apaisant pour votre repos.', 'Waves'),
('Wi-Fi Haut Débit', 'Connexion gratuite dans tout l\'établissement.', 'Wifi');

-- GALLERY (55 Total Images)
INSERT INTO gallery (title, image_url, category) VALUES
('Chambre Harmonie', '/Images/cd84752d-ed35-4e35-be6a-0d68a82dee0e.jpg', 'Chambres'),
('Chambre Simplicité', '/Images/ae09e9a2-18c2-44c3-abb4-9899fb67e3ef.jpg', 'Chambres'),
('Chambre Climée', '/Images/03fb9daa-e814-4377-84c4-a95f598b2f55.jpg', 'Chambres'),
('Lit King Size', '/Images/29bb3a0e-1946-4db1-841a-8b0c5095071a.jpg', 'Chambres'),
('Confort Premium', '/Images/6d2691ec-8b2b-4940-bca3-d0a161e4bc5f.jpg', 'Chambres'),
('Espace Sommeil', '/Images/7887fbb9-3d3a-4ddf-ab0a-be8af007d635.jpg', 'Chambres'),
('Espace Salon', '/Images/ab0a7447-927d-43cf-9375-7956ce619428.jpg', 'Chambres'),
('Suite Familiale', '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg', 'Chambres'),
('Espace Restauration', '/Images/bbbe2410-d06f-4968-95d5-4ebe65b80f4c.jpg', 'Restaurant'),
('Le Bar', '/Images/3be1bf34-052b-4e5b-9f8e-cc326ce23415.jpg', 'Restaurant'),
('Service Bar', '/Images/3ed07405-0775-4762-8707-7e4d5a4a4a72.jpg', 'Restaurant'),
('Entrée Principale', '/Images/3734c2e2-8861-4883-a265-352340bf9ef8.jpg', 'Espaces'),
('La Terrasse', '/Images/ce9db6be-f16d-4e3e-8a0d-a16ea95d3dcd.jpg', 'Espaces'),
('Jardin Relax', '/Images/00093e73-a1f7-4db6-b2ff-c6432c42bf08.jpg', 'Espaces'),
('Allée du Jardin', '/Images/29a9aed9-e630-4350-8151-b44118b66e83.jpg', 'Espaces'),
('Coin Détente', '/Images/3f603029-651e-4f97-ac3b-805c15719bad.jpg', 'Espaces'),
('Espace Verdoyant', '/Images/491086c6-8ded-43ba-8f0d-792926a824a8.jpg', 'Espaces'),
('Nature & Calme', '/Images/d8ec098d-c1cf-4291-818e-4a616f6f8367.jpg', 'Espaces'),
('Spécialité du Chef', '/Images/PLAT 1.jpg', 'Restaurant'),
('Saveurs Locales', '/Images/PLAT 2.jpg', 'Restaurant'),
('Art Culinaire', '/Images/PLAT 3.jpg', 'Restaurant'),
('Gourmandise', '/Images/PLAT 4.jpg', 'Restaurant'),
('Buffet Petit Déjeuner', '/Images/Plat 5.jpg', 'Restaurant'),
('Suite Noblesse - Chambre', '/Images/SUITE NOBLESSE 3.jpg', 'Chambres'),
('Suite Noblesse - Salon', '/Images/SUITE NOBLESSE 4.jpg', 'Chambres'),
('Suite Noblesse - Vue', '/Images/SUITE NOBLESSE 5.jpg', 'Chambres'),
('Site Abomey-Calavi', '/Images/SITE ABOMEY CALAVI.jpg', 'Espaces'),
('Site Allada', '/Images/SITE ALLADA.jpg', 'Espaces'),
('Chambre Allada Standard', '/Images/CAHMBRE ALLADA.jpg', 'Chambres'),
('Chambre Allada Double', '/Images/CHAMBRE ALLADA 2.jpg', 'Chambres'),
('Chambre Allada Confort', '/Images/CHAMBRE ALLADA 3.jpg', 'Chambres');

-- 24 Event Images
INSERT INTO gallery (title, image_url, category) VALUES
('Évènement', '/Images/Evènements/0b349df9-2703-4b41-a6b3-b383dedba918.jpg', 'Événements'),
('Évènement', '/Images/Evènements/12521fea-7496-4445-bc8a-19139fc9f685.jpg', 'Événements'),
('Évènement', '/Images/Evènements/3b491ac5-b57b-43f5-a93b-ea05b509d126.jpg', 'Événements'),
('Évènement', '/Images/Evènements/5ceb83a3-c5f1-46f2-a994-e774d1f57745.jpg', 'Événements'),
('Évènement', '/Images/Evènements/5d34b7e1-e7f3-4b0d-b0a0-55ce9df70ccc.jpg', 'Événements'),
('Évènement', '/Images/Evènements/68586138-5cae-4ec0-a9fe-68fb1442cca7.jpg', 'Événements'),
('Évènement', '/Images/Evènements/687e827b-d4fd-4251-aa95-73ff9ecf902e.jpg', 'Événements'),
('Évènement', '/Images/Evènements/6ee9eea9-22ed-4bb4-be2c-f3d569ab0ace.jpg', 'Événements'),
('Évènement', '/Images/Evènements/7dc7be60-2f72-4eb3-b73a-2cc17a31e72c.jpg', 'Événements'),
('Évènement', '/Images/Evènements/a3a8984e-c76b-4fcf-9acc-e7fc42a5b6fc.jpg', 'Événements'),
('Évènement', '/Images/Evènements/a6c3e34c-6ff4-4858-8cd3-778ff26fa260.jpg', 'Événements'),
('Évènement', '/Images/Evènements/b2b9877e-da2b-41c5-ae83-2bbe57d5c978.jpg', 'Événements'),
('Évènement', '/Images/Evènements/ba2a5060-2f67-443c-9bf9-f46857e00490.jpg', 'Événements'),
('Évènement', '/Images/Evènements/cbaeaeeb-ee7d-49d9-9393-d8bf87871ac3.jpg', 'Événements'),
('Évènement', '/Images/Evènements/cefc7755-3392-4e9f-8bcd-64dae739c406.jpg', 'Événements'),
('Évènement', '/Images/Evènements/d44bb73f-bc13-4476-aa1a-02c65ab31f21.jpg', 'Événements'),
('Évènement', '/Images/Evènements/d53d8ee7-d2d4-4371-8140-d941e8b59d9e.jpg', 'Événements'),
('Évènement', '/Images/Evènements/e5ad3cfd-bba5-4e37-b0c2-75067cb59802.jpg', 'Événements'),
('Évènement', '/Images/Evènements/e900a055-e3c7-4af1-aeec-19eaa12994b2.jpg', 'Événements'),
('Évènement', '/Images/Evènements/f052d30c-8755-4a98-89d3-07b3e5293eab.jpg', 'Événements'),
('Évènement', '/Images/Evènements/f390988e-cc7c-4651-811f-7ced1d2d491c.jpg', 'Événements'),
('Évènement', '/Images/Evènements/f83185dd-06f9-4a14-80bf-8113602561a4.jpg', 'Événements'),
('Évènement', '/Images/Evènements/fa304c7b-d723-4798-b6da-88705e0b9e75.jpg', 'Événements'),
('Évènement', '/Images/Evènements/fc4d4165-e94d-4fd0-8899-41ca4f850c47.jpg', 'Événements');

INSERT INTO site_settings (key, value, description) VALUES
('contact_address_calavi', 'Abomey-Calavi, Bénin', 'Adresse physique du site de Calavi'),
('contact_whatsapp_calavi', '+229 01 66 65 57 57 / 01 95 43 92 33', 'Numéro WhatsApp du site de Calavi'),
('contact_address_allada', 'Quartier Dagleta, en face du Centre Marial (Immaculée Conception), Allada, Bénin', 'Adresse physique du site de Allada'),
('contact_whatsapp_allada', '+229 01 67 61 09 09 / 01 95 43 92 33', 'Numéro WhatsApp du site de Allada'),
('contact_email_official', 'contact@steelisabethhotel.com', 'Email officiel de la réception');

-- 3. SÉCURITÉ & RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public Read Room Images" ON room_images FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Insert Reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Contacts" ON contacts FOR INSERT WITH CHECK (true);

-- RECEPTION POLICIES
DO $$
DECLARE
    reception_tables TEXT[] := ARRAY['reservations', 'clients', 'stays', 'room_images', 'rooms'];
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(reception_tables)
    LOOP
        EXECUTE format('CREATE POLICY "Reception Access %s" ON %I FOR ALL TO authenticated 
            USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''reception''))
            WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ''reception''))', t, t);
    END LOOP;
END $$;

-- ADMIN POLICIES
DO $$
DECLARE
    super_admins TEXT[] := ARRAY['admin@steelisabethhotel.com', 'dohounnonjaures@gmail.com'];
BEGIN
    FOR i IN 1..array_length(super_admins, 1) LOOP
        EXECUTE 'CREATE POLICY "Admin Full Access Profiles ' || i || '" ON profiles FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Rooms ' || i || '" ON rooms FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Room Images ' || i || '" ON room_images FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Gallery ' || i || '" ON gallery FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Services ' || i || '" ON services FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Settings ' || i || '" ON site_settings FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
    END LOOP;
END $$;

-- AUTH TRIGGER FOR PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id, 
    new.email, 
    CASE 
      WHEN new.email IN ('admin@steelisabethhotel.com', 'dohounnonjaures@gmail.com') THEN 'admin'
      WHEN new.email IN ('receptioncalavi@steelisabethhouse.com', 'receptionallada@steelisabethhouse.com') THEN 'reception'
      ELSE 'reception'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- CONFIRMATION ADMIN
UPDATE auth.users SET email_confirmed_at = now() WHERE email = 'admin@steelisabethhotel.com';
