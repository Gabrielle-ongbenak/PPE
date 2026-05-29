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
    documents_path TEXT,
    statut ENUM('valide','rejete','en_attente') DEFAULT 'en_attente',
    use_role ENUM('agent','admin') NOT NULL,
    created_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP
);

CREATE TABLE logements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_agent INT NOT NULL,
    id_type INT NOT NULL,
    ville VARCHAR(60) NOT NULL,
    quartier VARCHAR(60) NOT NULL,
    adresse_map VARCHAR(255),
    prix DECIMAL(10,2) NOT NULL,
    descriptions TEXT,
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
    date_debut TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_fin TIMESTAMP NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    statut ENUM('actif','expire') DEFAULT 'actif',
    reference_paiement VARCHAR(255) NOT NULL,

    FOREIGN KEY(id_agent) REFERENCES agents(id)
);

CREATE TABLE clients(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);