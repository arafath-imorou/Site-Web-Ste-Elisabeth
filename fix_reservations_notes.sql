-- Ajouter la colonne "notes" à la table des réservations
-- Cette colonne stockera le type d'événement et les demandes spécifiques pour les salles de conférence

ALTER TABLE reservations
ADD COLUMN IF NOT EXISTS notes text;
