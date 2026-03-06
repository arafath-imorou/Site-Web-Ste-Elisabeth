-- SQL Script to manually update room images and galleries to match the latest normalized file structure.

-- 1. Update main images in 'rooms' table
UPDATE rooms SET image = '/Images/harmonie_v2.jpg' WHERE name = 'Harmonie' AND site = 'Abomey-Calavi';
UPDATE rooms SET image = '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg' WHERE name = 'Simplicité' AND site = 'Abomey-Calavi';
UPDATE rooms SET image = '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg' WHERE name = 'Tranquilité' AND site = 'Abomey-Calavi';
UPDATE rooms SET image = '/Images/CHAMBRE DOUCEUR.jpg' WHERE name = 'Douceur' AND site = 'Abomey-Calavi';
UPDATE rooms SET image = '/Images/SUITE NOBLESSE.jpg' WHERE name = 'Noblesse' AND site = 'Abomey-Calavi';
UPDATE rooms SET image = '/Images/SALLE DE CONFERENCE.jpg' WHERE name = 'Salle de Conférence' AND site = 'Abomey-Calavi';

UPDATE rooms SET image = '/Images/CHAMBRE ALLADA.jpg' WHERE name = 'Chambre Standard (2 places)' AND site = 'Allada';
UPDATE rooms SET image = '/Images/CHAMBRE ALLADA 2.jpg' WHERE name = 'Chambre Standard (3 places)' AND site = 'Allada';
UPDATE rooms SET image = '/Images/CHAMBRE ALLADA 3.jpg' WHERE name = 'Chambre Climée' AND site = 'Allada';

-- 2. Clear and repopulate the 'room_images' galleries
DELETE FROM room_images;

-- Abomey-Calavi Sites
INSERT INTO room_images (room_id, url) SELECT id, '/Images/harmonie_v2.jpg' FROM rooms WHERE name = 'Harmonie' AND site = 'Abomey-Calavi';

INSERT INTO room_images (room_id, url) SELECT id, '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg' FROM rooms WHERE name = 'Simplicité' AND site = 'Abomey-Calavi';

INSERT INTO room_images (room_id, url) SELECT id, '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg' FROM rooms WHERE name = 'Tranquilité' AND site = 'Abomey-Calavi';
INSERT INTO room_images (room_id, url) SELECT id, '/Images/6d2691ec-8b2b-4940-bca3-d0a161e4bc5f.jpg' FROM rooms WHERE name = 'Tranquilité' AND site = 'Abomey-Calavi';

INSERT INTO room_images (room_id, url) SELECT id, '/Images/CHAMBRE DOUCEUR.jpg' FROM rooms WHERE name = 'Douceur' AND site = 'Abomey-Calavi';
INSERT INTO room_images (room_id, url) SELECT id, '/Images/4c895919-1d54-42ed-94ca-a93e581f0cb2.jpg' FROM rooms WHERE name = 'Douceur' AND site = 'Abomey-Calavi';

INSERT INTO room_images (room_id, url) SELECT id, '/Images/SUITE NOBLESSE.jpg' FROM rooms WHERE name = 'Noblesse' AND site = 'Abomey-Calavi';
INSERT INTO room_images (room_id, url) SELECT id, '/Images/SUITE NOBLESSE 3.jpg' FROM rooms WHERE name = 'Noblesse' AND site = 'Abomey-Calavi';
INSERT INTO room_images (room_id, url) SELECT id, '/Images/SUITE NOBLESSE 4.jpg' FROM rooms WHERE name = 'Noblesse' AND site = 'Abomey-Calavi';
INSERT INTO room_images (room_id, url) SELECT id, '/Images/SUITE NOBLESSE 5.jpg' FROM rooms WHERE name = 'Noblesse' AND site = 'Abomey-Calavi';

-- Allada Sites
INSERT INTO room_images (room_id, url) SELECT id, '/Images/CHAMBRE ALLADA.jpg' FROM rooms WHERE name = 'Chambre Standard (2 places)' AND site = 'Allada';
INSERT INTO room_images (room_id, url) SELECT id, '/Images/CHAMBRE ALLADA 2.jpg' FROM rooms WHERE name = 'Chambre Standard (3 places)' AND site = 'Allada';
INSERT INTO room_images (room_id, url) SELECT id, '/Images/CHAMBRE ALLADA 3.jpg' FROM rooms WHERE name = 'Chambre Climée' AND site = 'Allada';
INSERT INTO room_images (room_id, url) SELECT id, '/Images/CHAMBRE ALLADA.jpg' FROM rooms WHERE name = 'Chambre Climée' AND site = 'Allada';

-- 3. Cleanup Gallery table
UPDATE gallery SET image_url = '/Images/harmonie_v2.jpg' WHERE title = 'Chambre Harmonie';
UPDATE gallery SET image_url = '/Images/03fb9daa-e814-4377-84c4-a95f598b2f55.jpg' WHERE title = 'Chambre Climée';
