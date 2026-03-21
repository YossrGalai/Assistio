 ASSISTIO – Plateforme de Services de Proximité

ASSISTIO est une plateforme web collaborative permettant de connecter des utilisateurs pour des services de proximité (courses, aide à domicile, bricolage, etc.) en fonction de leur localisation.

L’objectif est de structurer et digitaliser les échanges informels en Tunisie en offrant une solution simple, sécurisée et accessible.

 *Fonctionnalités principales
 *Authentification sécurisée (JWT)
 *Gestion des utilisateurs (profil, réputation)
 *Publication et gestion des demandes
 *Géolocalisation avec carte interactive (Leaflet)
 * Recherche et filtrage par localisation
 * Notifications en temps réel (Socket.io)
 * Upload d’images (Cloudinary)
 * Dashboard utilisateur
* Technologies utilisées
🔹 Frontend
React.js
TypeScript
Vite
React Router
Leaflet
🔹 Backend
Node.js
Express.js
JWT (authentification)
Socket.io
🔹 Base de données & Cloud
MongoDB Atlas
Cloudinary
🔹 Outils
GitHub
Postman
Visual Studio Code
  * Architecture

Le projet suit une architecture client–serveur basée sur une API REST :

Frontend : interface utilisateur (SPA React)
Backend : gestion logique et API
Base de données : stockage des utilisateurs, demandes et notifications
⚙️ Installation et exécution
1️⃣ Cloner le projet
git clone https://github.com/ton-username/assistio.git
cd assistio
2️⃣ Installer les dépendances
Backend
cd backend
npm install
Frontend
cd frontend
npm install
3️⃣ Configurer les variables d’environnement

Créer un fichier .env dans le backend :

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_URL=your_cloudinary_config
4️⃣ Lancer le projet
Backend
npm run dev
Frontend
npm run dev




page d’accueil
carte interactive
dashboard utilisateur
* Tests
Tests API avec Postman
Tests manuels des fonctionnalités
Validation progressive par sprint
* Méthodologie

Le projet a été réalisé en utilisant la méthodologie Agile (Scrum) :

Organisation en sprints
Gestion via backlog
Développement itératif
Amélioration continue
* Objectifs
Faciliter l’accès aux services de proximité
Améliorer la mise en relation entre utilisateurs
Créer un environnement fiable et sécurisé
Encourager la solidarité locale
* Équipe :
Emna Kalel
Yossr Galai
Maha Tlili
📄 Licence

Projet réalisé dans un cadre académique année universitaire 2025-2026.
