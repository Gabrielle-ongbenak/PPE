-- DROP DATABASE IF EXISTS logi_cam;
CREATE DATABASE logi_cam;
USE logi_cam;

CREATE TABLE types_logement(       
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom ENUM('chambre','studio','appartement') NOT NULL
);

CREATE TABLE agents(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    nom_agence VARCHAR(255) NULL,
    documents_path TEXT,
    statut ENUM('valide','rejete','en_attente') DEFAULT 'en_attente',
    use_role ENUM('agent','admin') NOT NULL,
    created_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP
);

CREATE TABLE logements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NULL,
    id_agent INT NOT NULL,
    id_type INT NOT NULL,
    ville VARCHAR(60) NOT NULL,
    quartier VARCHAR(60) NOT NULL,
    region VARCHAR(60) NULL,
    adresse_map VARCHAR(255),
    prix DECIMAL(10,2) NOT NULL,
    descriptions TEXT,
    chambres INT DEFAULT 1,
    salles_bain INT DEFAULT 1,
    surface_m2 DECIMAL(10,2) NULL,
    statut ENUM('disponible','occupe') DEFAULT 'disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_agent) REFERENCES agents(id),
    FOREIGN KEY (id_type) REFERENCES types_logement(id)
);

CREATE TABLE medias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publication_id INT NOT NULL,
    url_media TEXT NOT NULL,
    type_media ENUM('photo','video') DEFAULT 'photo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(publication_id) REFERENCES logements(id)
);

CREATE TABLE abonnements(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_agent INT NOT NULL,
    plan ENUM('basic','pro','premium') DEFAULT 'basic',
    date_debut TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_fin TIMESTAMP NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    statut ENUM('actif','expire') DEFAULT 'actif',
    reference_paiement VARCHAR(255) NOT NULL,

    FOREIGN KEY(id_agent) REFERENCES agents(id)
);

CREATE TABLE contact_messages (
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

INSERT INTO types_logement (nom) VALUES ('chambre'), ('studio'), ('appartement');

CREATE TABLE clients(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expediteur_id INT NOT NULL,
    expediteur_type ENUM('agent', 'client') NOT NULL,
    destinataire_id INT NOT NULL,
    destinataire_type ENUM('agent', 'client') NOT NULL,
    logement_id INT NULL,
    contenu TEXT NOT NULL,
    est_lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (logement_id) REFERENCES logements(id) ON DELETE SET NULL
);