# Guide de Déploiement et de Mise en Ligne

Ce document explique comment préparer le projet PPE pour un déploiement en ligne et comment gérer le push vers la branche principale.

## 1. Préparation du Code (Git)

Si on vous a demandé de push sur la branche `main` :

1.  **Vérifiez votre branche actuelle** :
    ```bash
    git branch
    ```
2.  **Ajoutez tous les fichiers modifiés** :
    ```bash
    git add .
    ```
3.  **Faites un commit de vos changements** :
    ```bash
    git commit -m "Finalisation des fonctionnalités : Dashboards, Messagerie, Photos et IA"
    ```
4.  **Push vers la branche main** :
    ```bash
    git push origin main
    ```
    *(Note : Si vous êtes sur une autre branche, faites `git push origin ma-branche:main` ou fusionnez d'abord).*

## 2. Configuration pour la Production

Lorsqu'une personne déploiera le projet, elle devra configurer les variables d'environnement suivantes sur le serveur de production (souvent via un dashboard comme Heroku, Vercel, ou un fichier `.env` sur un VPS) :

### Backend (.env)
- `PORT`: Le port d'écoute (ex: 3000)
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`: Informations de la base de données MySQL en ligne.
- `JWT_SECRET`: Une clé secrète longue et complexe pour sécuriser les tokens.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Pour le stockage des photos.
- `GEMINI_API_KEY`: Votre clé Google AI pour l'assistant.

### Frontend
- Modifiez `API_BASE` dans `src/services/api.js` pour pointer vers l'URL de votre backend déployé (ex: `https://votre-api.herokuapp.com`).

## 3. Base de Données en Ligne

Vous n'avez pas besoin de "mettre votre BD locale en ligne" directement. Le déploiement implique généralement :
1.  Créer une base de données MySQL vide chez un hébergeur (ex: TiDB, PlanetScale, Clever Cloud).
2.  Exécuter les scripts de migration pour créer les tables :
    ```bash
    npm run migrate
    ```
3.  (Optionnel) Ajouter l'admin par défaut :
    ```bash
    npm run seed:admin
    ```

## 4. Recommandations Finales
- Assurez-vous que le dossier `uploads/` (s'il existe localement) n'est pas utilisé pour les photos en production, car nous utilisons **Cloudinary**.
- Vérifiez que votre `.gitignore` exclut bien le fichier `.env` pour ne pas exposer vos clés secrètes sur GitHub.
