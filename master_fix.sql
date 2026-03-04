-- ==========================================
-- 1. CLEANUP & SCHEMA (Run this first)
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cleanup existing tables
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS room_images CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;

-- ROOMS TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROOM IMAGES TABLE
CREATE TABLE room_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RESERVATIONS TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SERVICES TABLE
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OFFERS TABLE
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage INTEGER,
    valid_until DATE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GALLERY TABLE
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TESTIMONIALS TABLE
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CONTACTS TABLE
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public Read Room Images" ON room_images FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);

-- PUBLIC INSERT POLICIES
CREATE POLICY "Public Insert Contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Reservations" ON reservations FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS
CREATE POLICY "Admin Full Access Rooms" ON rooms FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Room Images" ON room_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Reservations" ON reservations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Offers" ON offers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Contacts" ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- 2. SEED DATA (Populate the database)
-- ==========================================

-- SITE ABOMEY-CALAVI ROOMS
INSERT INTO rooms (name, description, price_per_night, capacity, site, amenities, image) VALUES
('Harmonie', 'Chambre Simple Ventillée', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur', 'Lit confortable'], '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg'),
('Simplicité (Ventillée)', 'Chambre Simple Ventillée', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur'], '/Images/ae09e9a2-18c2-44c3-abb4-9899fb67e3ef.jpg'),
('Simplicité (Climée)', 'Chambre Simple Climée', 12500, 2, 'Abomey-Calavi', ARRAY['Climatisation'], '/Images/ae09e9a2-18c2-44c3-abb4-9899fb67e3ef.jpg'),
('Tranquilité (Ventillée)', 'Chambre Simple Ventillée', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur'], '/Images/6d2691ec-8b2b-4940-bca3-d0a161e4bc5f.jpg'),
('Tranquilité (Climée)', 'Chambre Simple Climée', 12500, 2, 'Abomey-Calavi', ARRAY['Climatisation'], '/Images/6d2691ec-8b2b-4940-bca3-d0a161e4bc5f.jpg'),
('Douceur (Ventillée)', 'Chambre Salon meublés, cuisine, douche, Balcon', 20500, 3, 'Abomey-Calavi', ARRAY['Ventilateur', 'Cuisine équipée', 'Balcon', 'Salon meublé'], '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg'),
('Douceur (Climée)', 'Chambre Salon meublés, cuisine, douche, Balcon', 26500, 3, 'Abomey-Calavi', ARRAY['Climatisation', 'Cuisine équipée', 'Balcon', 'Salon meublé'], '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg'),
('Noblesse (Ventillée)', '2 chambres salon meublées, cuisine, douche et balcon', 31500, 4, 'Abomey-Calavi', ARRAY['Ventilateur', 'Cuisine équipée', 'Balcon', 'Grand Salon'], '/Images/12ab43e2-7078-45f2-89ea-4e037d24b1f9.jpg'),
('Noblesse (Climée)', '2 chambres salon meublées, cuisine, douche et balcon', 41500, 4, 'Abomey-Calavi', ARRAY['Climatisation', 'Cuisine équipée', 'Balcon', 'Grand Salon'], '/Images/12ab43e2-7078-45f2-89ea-4e037d24b1f9.jpg'),
('Salle de Conférence (Standard)', 'Equipement de Sonorisation (50 à 70 places)', 50000, 70, 'Abomey-Calavi', ARRAY['Sonorisation', 'Sièges confortables'], '/Images/699eb6ab-5a0f-45a4-a97a-245ba005d427.jpg'),
('Salle de Conférence (Premium)', 'Equipement de Sonorisation (50 à 70 places)', 70000, 70, 'Abomey-Calavi', ARRAY['Sonorisation', 'Climatisation', 'Vidéoprojecteur'], '/Images/699eb6ab-5a0f-45a4-a97a-245ba005d427.jpg');

-- SITE ALLADA ROOMS
INSERT INTO rooms (name, description, price_per_night, capacity, site, amenities, image) VALUES
('Chambre Standard (2 places)', 'Ventillée, Lit 2 places', 5500, 2, 'Allada', ARRAY['Ventilateur', 'Lit 2 places'], '/Images/7887fbb9-3d3a-4ddf-ab0a-be8af007d635.jpg'),
('Chambre Standard (3 places)', 'Ventillée, Lit 3 places', 8000, 3, 'Allada', ARRAY['Ventilateur', 'Lit 3 places'], '/Images/29bb3a0e-1946-4db1-841a-8b0c5095071a.jpg'),
('Chambre Climée', 'Climée, Lit 3 places', 10500, 3, 'Allada', ARRAY['Climatisation', 'Lit 3 places'], '/Images/03fb9daa-e814-4377-84c4-a95f598b2f55.jpg');

-- SERVICES
INSERT INTO services (name, description, icon) VALUES
('Restaurant Gastronomique', 'Une cuisine raffinée préparée par nos chefs étoilés.', 'Coffee'),
('Jardins & Promenade', 'Découvrez nos espaces verts et nos jardins tropicaux.', 'Sparkles'),
('Espace Détente', 'Un cadre naturel apaisant pour votre repos.', 'Waves'),
('Wi-Fi Haut Débit', 'Connexion gratuite dans tout l''établissement.', 'Wifi');

-- GALLERY
INSERT INTO gallery (title, image_url, category) VALUES
('Chambre Harmonie', '/Images/cd84752d-ed35-4e35-be6a-0d68a82dee0e.jpg', 'Suites'),
('Espace Restauration', '/Images/bbbe2410-d06f-4968-95d5-4ebe65b80f4c.jpg', 'Restaurant'),
('La Terrasse', '/Images/ce9db6be-f16d-4e3e-8a0d-a16ea95d3dcd.jpg', 'Espaces');
