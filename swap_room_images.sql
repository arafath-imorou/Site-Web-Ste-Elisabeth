-- Mise à jour des images principales des chambres suite à la réorganisation

-- 1. Tranquillité reçoit l'image originale de Harmonie
UPDATE rooms 
SET image = '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg'
WHERE name = 'Tranquilité' AND site = 'Abomey-Calavi';

-- 2. Simplicité reçoit l'image originale de Douceur
UPDATE rooms 
SET image = '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg'
WHERE name = 'Simplicité' AND site = 'Abomey-Calavi';

-- 3. Harmonie reçoit l'image originale de Noblesse (ou celle de Tranquilite comme demandé ? Le client a dit : "La photo de la chambre Harmonie revient à la chambre Tranquilitté. La photo de la chambre Douceur revient à la chambre Simplicité. La photo de la chambre Noblesse revient à Harmonie")
UPDATE rooms 
SET image = '/Images/12ab43e2-7078-45f2-89ea-4e037d24b1f9.jpg'
WHERE name = 'Harmonie' AND site = 'Abomey-Calavi';

-- Les images de Douceur et Noblesse restent inchangées comme convenu, elles seront en doublon pour le moment.
