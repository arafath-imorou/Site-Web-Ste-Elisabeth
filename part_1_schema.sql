-- ==========================================
-- 1. CLEANUP & SCHEMA
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
    prices JSONB,
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
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public Read Room Images" ON room_images FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);

-- PUBLIC INSERT POLICIES
CREATE POLICY "Public Insert Contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Reservations" ON reservations FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS (Restrict to specific admin email)
CREATE POLICY "Admin Full Access Rooms" ON rooms FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

CREATE POLICY "Admin Full Access Room Images" ON room_images FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

CREATE POLICY "Admin Full Access Reservations" ON reservations FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

CREATE POLICY "Admin Full Access Services" ON services FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

CREATE POLICY "Admin Full Access Offers" ON offers FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

CREATE POLICY "Admin Full Access Gallery" ON gallery FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');

CREATE POLICY "Admin Full Access Contacts" ON contacts FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');
