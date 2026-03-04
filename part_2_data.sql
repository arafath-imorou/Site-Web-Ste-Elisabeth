-- SEED DATA (CONTENU COMPLET)
INSERT INTO rooms (name, description, price_per_night, capacity, site, amenities, image, prices, order_index) VALUES
('Harmonie', 'Chambre Simple Ventillée', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur', 'Lit confortable', 'Vue sur jardin'], '/Images/6db85736-a267-495c-b05b-3164774635d4.jpg', '{"ventillee": 10500}', 1),
('Simplicité', 'Chambre Simple', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur', 'Vue verdure'], '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg', '{"ventillee": 10500, "climee": 12500}', 2),
('Tranquilité', 'Chambre Simple', 10500, 2, 'Abomey-Calavi', ARRAY['Ventilateur', 'Climatisation'], '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg', '{"ventillee": 10500, "climee": 12500}', 3),
('Douceur', 'Chambre Salon avec Balcon sur Jardin', 20500, 3, 'Abomey-Calavi', ARRAY['Cuisine équipée', 'Balcon Privé', 'Espace Vert'], '/Images/CHAMBRE DOUCEUR.jpg', '{"ventillee": 20500, "climee": 26500}', 4),
('Noblesse', '2 chambres salon meublées, cuisine, douche et balcon', 31500, 4, 'Abomey-Calavi', ARRAY['Cuisine équipée', 'Balcon', 'Grand Salon'], '/Images/SUITE NOBLESSE.jpg', '{"ventillee": 31500, "climee": 41500}', 5),
('Salle de Conférence', 'Equipement de Sonorisation (50 à 70 places)', 50000, 70, 'Abomey-Calavi', ARRAY['Sonorisation', 'Sièges confortables', 'Vidéoprojecteur'], '/Images/SALLE DE CONFERENCE.jpg', '{"ventillee": 50000, "climee": 70000}', 6),
('Chambre Standard (2 places)', 'Ventillée, Lit 2 places', 5500, 2, 'Allada', ARRAY['Ventilateur', 'Lit 2 places'], '/Images/CAHMBRE ALLADA.jpg', null, 1),
('Chambre Standard (3 places)', 'Ventillée, Lit 3 places', 8000, 3, 'Allada', ARRAY['Ventilateur', 'Lit 3 places'], '/Images/CHAMBRE ALLADA 2.jpg', null, 2),
('Chambre Climée', 'Climée, Lit 3 places', 10500, 3, 'Allada', ARRAY['Climatisation', 'Lit 3 places'], '/Images/CHAMBRE ALLADA 3.jpg', null, 3);

INSERT INTO room_images (room_id, url) 
SELECT id, '/Images/SUITE NOBLESSE 3.jpg' FROM rooms WHERE name = 'Noblesse' AND site = 'Abomey-Calavi' LIMIT 1;
INSERT INTO room_images (room_id, url) 
SELECT id, '/Images/SUITE NOBLESSE 4.jpg' FROM rooms WHERE name = 'Noblesse' AND site = 'Abomey-Calavi' LIMIT 1;
INSERT INTO room_images (room_id, url) 
SELECT id, '/Images/SUITE NOBLESSE 5.jpg' FROM rooms WHERE name = 'Noblesse' AND site = 'Abomey-Calavi' LIMIT 1;

-- SITE SETTINGS
INSERT INTO site_settings (key, value, description) VALUES
('contact_address_calavi', 'Abomey-Calavi, Bénin', 'Adresse physique du site de Calavi'),
('contact_whatsapp_calavi', '+229 01 66 65 57 57 / 01 95 43 92 33', 'Numéro WhatsApp du site de Calavi'),
('contact_address_allada', 'Quartier Dagleta, en face du Centre Marial (Immaculée Conception), Allada, Bénin', 'Adresse physique du site de Allada'),
('contact_whatsapp_allada', '+229 01 67 61 09 09 / 01 95 43 92 33', 'Numéro WhatsApp du site de Allada'),
('contact_email_official', 'contact@steelisabethhotel.com', 'Email officiel de la réception');

-- SERVICES
INSERT INTO services (name, description, icon) VALUES
('Restaurant Gastronomique', 'Une cuisine raffinée préparée par nos chefs étoilés.', 'Coffee'),
('Jardins & Promenade', 'Découvrez nos espaces verts et nos jardins tropicaux.', 'Sparkles'),
('Espace Détente', 'Un cadre naturel apaisant pour votre repos.', 'Waves'),
('Wi-Fi Haut Débit', 'Connexion gratuite dans tout l\'établissement.', 'Wifi');

-- GALLERY
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
('La Réception', '/Images/7cbbeea4-8825-4e89-9d81-ebc613ad9663.jpg', 'Événements'),
('Bureau Accueil', '/Images/6db85736-a267-495c-b05b-3164774635d4.jpg', 'Événements'),
('Salle de Conférence', '/Images/SALLE DE CONFERENCE.jpg', 'Événements'),
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
