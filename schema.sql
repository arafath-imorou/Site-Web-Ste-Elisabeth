-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cleanup existing tables (in correct order of dependencies)
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

-- PROFILES TABLE (RBAC)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'reception')) DEFAULT 'reception',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    order_index INTEGER DEFAULT 99,
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

-- CLIENTS TABLE
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unique_client_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    maiden_name TEXT,
    birth_date DATE,
    birth_place TEXT,
    department TEXT,
    country TEXT,
    profession TEXT,
    usual_residence TEXT,
    nationality TEXT,
    id_type TEXT,
    id_number TEXT,
    id_issue_date DATE,
    id_expiry_date DATE,
    id_issue_place TEXT,
    email TEXT,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- STAYS TABLE
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
    notes TEXT,
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

-- SITE SETTINGS TABLE
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NEWS TABLE
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    date_text TEXT,
    is_published BOOLEAN DEFAULT true
);

-- RESTAURANT MENUS TABLE
CREATE TABLE restaurant_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_menus ENABLE ROW LEVEL SECURITY;

-- PUBLIC POLICIES
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public Read Room Images" ON room_images FOR SELECT USING (true);
CREATE POLICY "Public Read Clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public Read Stays" ON stays FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read Menu" ON restaurant_menus FOR SELECT USING (true);
CREATE POLICY "Public Insert Contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Reservations" ON reservations FOR INSERT WITH CHECK (true);

-- RECEPTION POLICIES (Manage bookings and clients)
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

-- ADMIN POLICIES (Super Admins)
DO $$
DECLARE
    super_admins TEXT[] := ARRAY['admin@steelisabethhotel.com', 'dohounnonjaures@gmail.com'];
BEGIN
    FOR i IN 1..array_length(super_admins, 1) LOOP
        EXECUTE 'CREATE POLICY "Admin Full Access Profiles ' || i || '" ON profiles FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Rooms ' || i || '" ON rooms FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Room Images ' || i || '" ON room_images FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Clients ' || i || '" ON clients FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Stays ' || i || '" ON stays FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Reservations ' || i || '" ON reservations FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Services ' || i || '" ON services FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Offers ' || i || '" ON offers FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Gallery ' || i || '" ON gallery FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Contacts ' || i || '" ON contacts FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Settings ' || i || '" ON site_settings FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access News ' || i || '" ON news FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
        EXECUTE 'CREATE POLICY "Admin Full Access Menu ' || i || '" ON restaurant_menus FOR ALL TO authenticated USING (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''') WITH CHECK (auth.jwt() ->> ''email'' = ''' || super_admins[i] || ''')';
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
