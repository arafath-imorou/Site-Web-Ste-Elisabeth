-- ==========================================
-- AJOUT DE LA CONFIGURATION DYNAMIQUE
-- ==========================================

-- 1. CRÉATION DE LA TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DONNÉES INITIALES
INSERT INTO site_settings (key, value, description) VALUES
('contact_address_calavi', 'Abomey-Calavi, Bénin', 'Adresse physique du site de Calavi'),
('contact_whatsapp_calavi', '+229 61 66 65 57 57', 'Numéro WhatsApp du site de Calavi'),
('contact_address_allada', 'Allada, Bénin', 'Adresse physique du site de Allada'),
('contact_whatsapp_allada', '+229 61 67 61 69 09', 'Numéro WhatsApp du site de Allada'),
('contact_email_official', 'contact@steelisabethhotel.com', 'Email officiel de la réception')
ON CONFLICT (key) DO NOTHING;

-- 3. SÉCURITÉ (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Settings" ON site_settings;
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Full Access Settings" ON site_settings;
CREATE POLICY "Admin Full Access Settings" ON site_settings FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@steelisabethhotel.com');
