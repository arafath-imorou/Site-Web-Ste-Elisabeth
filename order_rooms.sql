-- Add order_index column
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 99;

-- Abomey-Calavi Rooms Order
UPDATE rooms SET order_index = 1 WHERE name = 'Harmonie' AND site = 'Abomey-Calavi';
UPDATE rooms SET order_index = 2 WHERE name = 'Simplicité' AND site = 'Abomey-Calavi';
UPDATE rooms SET order_index = 3 WHERE name = 'Tranquilité' AND site = 'Abomey-Calavi';
UPDATE rooms SET order_index = 4 WHERE name = 'Douceur' AND site = 'Abomey-Calavi';
UPDATE rooms SET order_index = 5 WHERE name = 'Noblesse' AND site = 'Abomey-Calavi';
UPDATE rooms SET order_index = 6 WHERE name = 'Salle de Conférence' AND site = 'Abomey-Calavi';

-- Allada Rooms Order
UPDATE rooms SET order_index = 1 WHERE name = 'Chambre Standard (2 places)' AND site = 'Allada';
UPDATE rooms SET order_index = 2 WHERE name = 'Chambre Standard (3 places)' AND site = 'Allada';
UPDATE rooms SET order_index = 3 WHERE name = 'Chambre Climée' AND site = 'Allada';
