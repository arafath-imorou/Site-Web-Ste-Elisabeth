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

INSERT INTO site_settings (key, value, description) VALUES
('contact_address_calavi', 'Abomey-Calavi, Bénin', 'Adresse physique du site de Calavi'),
('contact_whatsapp_calavi', '+229 01 66 65 57 57 / 01 95 43 92 33', 'Numéro WhatsApp du site de Calavi'),
('contact_address_allada', 'Quartier Dagleta, en face du Centre Marial (Immaculée Conception), Allada, Bénin', 'Adresse physique du site de Allada'),
('contact_whatsapp_allada', '+229 01 67 61 09 09 / 01 95 43 92 33', 'Numéro WhatsApp du site de Allada'),
('contact_email_official', 'contact@steelisabethhotel.com', 'Email officiel de la réception');

INSERT INTO services (name, description, icon) VALUES
('Restaurant Gastronomique', 'Une cuisine raffinée préparée par nos chefs étoilés.', 'Coffee'),
('Jardins & Promenade', 'Découvrez nos espaces verts et nos jardins tropicaux.', 'Sparkles'),
('Espace Détente', 'Un cadre naturel apaisant pour votre repos.', 'Waves'),
('Wi-Fi Haut Débit', 'Connexion gratuite dans tout l\'établissement.', 'Wifi');
