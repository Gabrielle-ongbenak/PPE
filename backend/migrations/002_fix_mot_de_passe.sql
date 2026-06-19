-- Migration 002: Corrections critiques de la base de données
USE logi_cam;

-- 1. Fix: ajouter la colonne mot_de_passe si manquante (cause du bug 500 à l'inscription)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS mot_de_passe VARCHAR(255) NOT NULL AFTER email;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS mot_de_passe VARCHAR(255) NOT NULL AFTER email;

-- 2. Ajouter photo_url pour les agents
ALTER TABLE agents ADD COLUMN IF NOT EXISTS photo_url TEXT NULL AFTER nom_agence;
