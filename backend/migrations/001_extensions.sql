-- Extensions pour aligner la BD avec le cahier des charges
USE logi_cam;

-- Agent: nom d'agence
ALTER TABLE agents ADD COLUMN IF NOT EXISTS nom_agence VARCHAR(255) NULL AFTER telephone;

-- Logements: champs supplementaires
ALTER TABLE logements ADD COLUMN IF NOT EXISTS titre VARCHAR(255) NULL AFTER id;
ALTER TABLE logements ADD COLUMN IF NOT EXISTS region VARCHAR(60) NULL AFTER quartier;
ALTER TABLE logements ADD COLUMN IF NOT EXISTS chambres INT DEFAULT 1;
ALTER TABLE logements ADD COLUMN IF NOT EXISTS salles_bain INT DEFAULT 1;
ALTER TABLE logements ADD COLUMN IF NOT EXISTS surface_m2 DECIMAL(10,2) NULL;

-- Abonnements: plan tarifaire
ALTER TABLE abonnements ADD COLUMN IF NOT EXISTS plan ENUM('basic','pro','premium') DEFAULT 'basic' AFTER id_agent;

-- Messages de contact visiteur -> agent
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    agent_id INT NOT NULL,
    visitor_name VARCHAR(255) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20) NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES logements(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Types de logement (seed si vide)
INSERT IGNORE INTO types_logement (id, nom) VALUES (1, 'chambre'), (2, 'studio'), (3, 'appartement');
