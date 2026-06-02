# Logicam - Plateforme Immobilière

Application full-stack (React + Node.js) pour la gestion immobilière au Cameroun.

## Installation et Lancement

Pour éviter les erreurs de connexion (`ECONNREFUSED`), suivez ces étapes dans l'ordre :

### 1. Backend (Serveur)
Ouvrez un terminal dans le dossier `backend` :
```bash
cd backend
npm install
npm run dev
```
*Le serveur doit afficher : `Serveur démarré sur http://localhost:3000`*

## Configuration de la Base de Données (MySQL)

Pour que l'application fonctionne, vous devez initialiser votre base de données locale :

1. **Création des tables** :
   - Ouvrez votre outil de gestion de base de données (ex: **DBeaver**).
   - Créez une nouvelle base de données nommée `logi_cam`.
   - Importez et exécutez le script SQL situé dans `backend/logi_cam.sql`. Cela créera toutes les tables nécessaires (agents, logements, messages, etc.).

2. **Configuration des accès** :
   - Dans le dossier `backend`, copiez le fichier `.env.example` vers `.env`.
   - Modifiez le fichier `.env` avec vos propres identifiants MySQL (`DB_USER` et `DB_PASSWORD`).

### 2. Frontend (Application)
Ouvrez un **deuxième** terminal dans le dossier `frontend` :
```bash
cd frontend
npm install
npm run dev
```
*L'application sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).*

## Fonctionnalités Clés
- **Recherche & Filtres** : Filtrage par ville, quartier et type de logement (Studio, Appartement, etc.).
- **Espace Agent** : Création, modification et suppression d'annonces. Gestion de la disponibilité.
- **Messagerie** : Système de discussion entre clients et agents.
- **Profil Dynamique** : Gestion des informations personnelles.

## Notes Techniques
- **Proxy Vite** : Le frontend est configuré pour rediriger les appels `/api` vers `http://127.0.0.1:3000`.
- **Base de données** : MySQL via Sequelize. Assurez-vous d'avoir configuré le fichier `.env` dans le dossier `backend`.
