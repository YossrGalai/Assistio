# ASSISTIO – Plateforme de Services de Proximité

ASSISTIO est une plateforme web collaborative permettant de connecter des utilisateurs pour des services de proximité (courses, aide à domicile, bricolage, etc.) en fonction de leur localisation.

L’objectif du projet est de structurer et digitaliser les échanges informels en Tunisie en proposant une solution simple, sécurisée et accessible.

---

## Fonctionnalités principales

- Authentification sécurisée basée sur JWT  
- Gestion des utilisateurs (profil, système de réputation)  
- Publication et gestion des demandes de services  
- Géolocalisation avec carte interactive (Leaflet)  
- Recherche et filtrage par localisation  
- Notifications en temps réel (Socket.io)  
- Upload d’images via Cloudinary  
- Tableau de bord utilisateur  

---

## Technologies utilisées

### Frontend
- React.js  
- TypeScript  
- Vite  
- React Router  
- Leaflet  

### Backend
- Node.js  
- Express.js  
- JSON Web Token (JWT)  
- Socket.io  

### Base de données et Cloud
- MongoDB Atlas  
- Cloudinary  

### Outils de développement
- GitHub  
- Postman  
- Visual Studio Code  

---

## Architecture

Le projet repose sur une architecture client–serveur basée sur une API REST.

- Frontend : application SPA développée avec React  
- Backend : API REST assurant la logique métier avec Node.js et Express  
- Base de données : stockage des utilisateurs, demandes et notifications avec MongoDB  

Cette architecture garantit modularité, maintenabilité et évolutivité du système.

---

## Installation et exécution

### 1. Cloner le projet

git clone https://github.com/YossrGalai/Assistio.git   
cd assistio
### 2. Installer les dépendances
Backend  
cd backend  
npm install  
Frontend  
cd frontend  
npm install  
### 3. Configuration des variables d’environnement

Créer un fichier .env dans le dossier backend :  

MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret_key  
CLOUDINARY_URL=your_cloudinary_config  
### 4. Lancer l’application  
Backend  
npm run dev  
Frontend  
npm run dev  
Aperçu de l’application  
Page d’accueil  
Carte interactive   
Tableau de bord utilisateur  
Tests  
Tests des API avec Postman  
Tests fonctionnels manuels  
Validation progressive par sprint  
Méthodologie  

Le projet a été réalisé selon une approche Agile basée sur Scrum :  

Organisation du travail en sprints  
Gestion des fonctionnalités via un backlog  
Développement itératif  
Amélioration continue  
Objectifs  
Faciliter l’accès aux services de proximité   
Améliorer la mise en relation entre utilisateurs  
Garantir un environnement fiable et sécurisé  
Encourager la solidarité locale  

### Équipe
Emna Kallel  
Yossr Galai  
Maha Tlili  
### Licence  

Projet réalisé dans le cadre académique – année universitaire 2025-2026
