-- Refine Gallery 'Chambres' Category
-- Delete old/generic images and keep only verified room images

DELETE FROM gallery WHERE category = 'Chambres';

INSERT INTO gallery (title, image_url, category) VALUES
-- Abomey-Calavi Rooms
('Chambre Harmonie', '/Images/CHAMBRE HARMONIE.jpg', 'Chambres'),
('Chambre Simplicité', '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg', 'Chambres'),
('Chambre Tranquilité', '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg', 'Chambres'),
('Chambre Douceur', '/Images/CHAMBRE DOUCEUR.jpg', 'Chambres'),
('Suite Noblesse', '/Images/SUITE NOBLESSE.jpg', 'Chambres'),
('Salle de Conférence', '/Images/SALLE DE CONFERENCE.jpg', 'Chambres'),

-- Allada Rooms
('Chambre Allada (2 places)', '/Images/CHAMBRE ALLADA 2.jpg', 'Chambres'),
('Chambre Allada (3 places)', '/Images/CHAMBRE ALLADA.jpg', 'Chambres'),
('Chambre Allada Climée', '/Images/CHAMBRE ALLADA 3.jpg', 'Chambres'),

-- Suite Noblesse Secondary Images
('Suite Noblesse - Chambre', '/Images/SUITE NOBLESSE 3.jpg', 'Chambres'),
('Suite Noblesse - Salon', '/Images/SUITE NOBLESSE 4.jpg', 'Chambres'),
('Suite Noblesse - Vue', '/Images/SUITE NOBLESSE 5.jpg', 'Chambres');
