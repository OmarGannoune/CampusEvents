# CampusEvents AI - La Vie Universitaire Intelligente 🎓

## 📱 Aperçu

**CampusEvents AI** est une application mobile multiplateforme développée en React Native / Expo, pensée pour simplifier et personnaliser la vie sur le campus. Plutôt que de naviguer à travers d'innombrables affiches ou groupes WhatsApp, l'application centralise tous les événements universitaires et utilise **l'Intelligence Artificielle (Groq & Llama 3)** pour aider chaque étudiant à trouver exactement ce qui correspond à son profil, ses contraintes et ses ambitions.

---

## 💡 L'Idée : Pourquoi CampusEvents AI ?

Ce qui a commencé comme un mini-projet académique pour le module de Développement Mobile a rapidement évolué vers une solution à un problème réel. En observant la façon dont les événements sont communiqués sur les campus, un constat clair est apparu : **les étudiants ratent souvent des opportunités (workshops, conférences, clubs) noyées dans le bruit de fond, tandis que les organisateurs peinent à atteindre la bonne audience.**

La solution ne consistait pas seulement à créer un simple catalogue d'événements, mais à y intégrer une couche d'intelligence. CampusEvents AI est né de cette vision :
- ✅ **Centralisation complète** — Un seul endroit pour tout le campus.
- ✅ **Intelligence Artificielle embarquée** — L'IA raisonne sur le catalogue pour vous guider.
- ✅ **Approche Privacy-First & Offline** — Base de données 100% locale (SQLite), sans backend intrusif.
- ✅ **Système à double rôle** — Une interface dédiée pour les administrateurs et une pour les étudiants.

La grande différence réside dans l'utilisation du **Prompt Engineering** et du **Caching IA**. L'application ne se contente pas d'afficher des données ; elle les analyse pour recommander, planifier et répondre aux questions naturelles des étudiants.

---

## 🎯 Fonctionnalités Principales

### 1. **L'Assistant IA (Le Cœur du Projet)** ⭐
Propulsé par l'API Groq (`llama-3.3-70b-versatile`), l'assistant comprend 4 modules distincts :
- 🔍 **Recherche Sémantique :** Trouvez des événements sans mots-clés exacts (ex: *"un événement pour préparer ma recherche de stage"*).
- ✨ **Recommandations Personnalisées :** L'IA analyse votre historique (inscriptions, favoris) et votre profil (filière, année) pour vous suggérer des événements inédits avec des justifications personnalisées.
- 🗓️ **Planificateur Intelligent :** Saisissez vos contraintes horaires (ex: *"J'ai cours lundi matin"*) et obtenez un planning généré par l'IA, sans aucun conflit.
- 💬 **Q/R sur le Catalogue :** Posez des questions ouvertes sur l'ensemble des événements du campus.

### 2. **Espace Étudiant & Catalogue**
- Vue chronologique des événements (À venir / Passés) avec filtres par catégories.
- Inscription en un clic avec blocage automatique si l'événement est complet ou expiré.
- Sauvegarde d'événements en favoris.
- Profil enrichi pour améliorer les suggestions de l'assistant.

### 3. **Tableau de Bord Admin**
- Gestion complète du cycle de vie des événements (Création, Modification, Suppression).
- Saisie optimisée avec sélecteurs de dates et de catégories modernes.
- Mise à jour en temps réel des jauges de capacité.

### 4. **Fonctionnalités Bonus Implémentées**
- 🔔 **Rappels Locaux (`expo-notifications`) :** Notification push programmée automatiquement 2 heures avant le début d'un événement inscrit.
- 📤 **Partage Natif :** Partage direct d'un événement vers d'autres applications (WhatsApp, SMS, etc.) via l'API native `Share`.
- ⚡ **Cache IA (SQLite) :** Mémorisation locale des réponses de l'IA pour éviter les appels API redondants et améliorer drastiquement les performances.

---

## 🏗️ Architecture

CampusEvents AI suit une architecture modulaire et moderne :

### **Couche de Données (Data Layer)**
- **SQLite (`expo-sqlite`) :** Base de données locale robuste en mode WAL.
- **Entités :** Modélisation relationnelle stricte (Événements, Inscriptions, Favoris, Cache IA).
- **Repositories :** Accès typé aux données via des services dédiés (`database/events.ts`, `database/llmResults.ts`).

### **Couche de Présentation (Presentation Layer)**
- **Expo Router :** Navigation basée sur les fichiers (File-based routing) pour séparer fluidement l'espace `(admin)` de l'espace `(student)`.
- **UI System :** Composants réutilisables (`EventCard`, `ScreenHeader`, `Button`) construits avec les API natives de React Native.
- **Gestion d'état :** React Hooks (`useEvents`, `useFavorites`) pour une interface réactive.

### **Couche IA (Services Layer)**
- Centralisation des appels dans `services/llm.ts`.
- Isolation et structuration des *System Prompts* (JSON-schemas) dans le dossier `/prompts`.

---

## 📊 Modèle de Données (Aperçu SQLite)

```text
Events (Catalogue)
  ├── ID (Primary Key)
  ├── Titre & Description
  ├── Catégorie (Talk, Workshop, Exam, etc.)
  ├── Dates (Début / Fin)
  ├── Localisation
  └── Capacité & Compteur d'inscriptions

Registrations (Inscriptions)
  ├── EventID (Foreign Key -> CASCADE)
  ├── UserID
  └── Statut (Confirmé / Annulé)

Favorites (Sauvegardes)
  ├── EventID (Foreign Key -> CASCADE)
  └── UserID

LLM Results (Cache IA)
  ├── InputText (La question de l'étudiant)
  ├── Type (search, reco, planning, qa)
  └── OutputText (La réponse JSON mise en cache)
```

---

## 🛠️ Stack Technique

| Composant | Technologie |
|-----------|-----------|
| **Framework UI** | React Native / Expo |
| **Langage** | TypeScript strict |
| **Navigation** | Expo Router |
| **Base de données** | SQLite (`expo-sqlite`) |
| **IA / LLM** | Groq API (`llama-3.3-70b-versatile`) |
| **Notifications** | `expo-notifications` |
| **Icônes** | Lucide React Native |

---

## 🚀 Pour Commencer

### Prérequis
- Node.js (v18+)
- Expo CLI
- Une clé API Groq

### Installation & Lancement
1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd CampusEvents
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Configurer l'environnement**
   Créer un fichier `.env` à la racine :
   ```env
   EXPO_PUBLIC_GROQ_API_KEY=gsk_votre_cle_api_ici
   ```
4. **Lancer le projet**
   ```bash
   npx expo start
   ```

### Comptes de Test
- **Admin :** `admin@campus.ma` / `admin123`
- **Étudiant :** `etudiant@campus.ma` / `etudiant123`

---

## 💾 Confidentialité & Stockage
- **100% Stockage Local :** Vos inscriptions et favoris sont conservés directement sur votre appareil via SQLite.
- **Cache IA Local :** L'historique de vos requêtes IA ne quitte pas l'appareil (à l'exception de l'inférence via l'API Groq).
- **Intégrité Automatique :** Suppression en cascade (`ON DELETE CASCADE`) activée pour garantir qu'aucun résidu de données ne subsiste si un admin supprime un événement.

---

## 👨‍💻 Effort d'Ingénierie & Défis Techniques

Pour atteindre un standard professionnel, plusieurs défis ont dû être relevés :

1. **Intégration et Caching IA (Le plus grand défi) :** Interroger un LLM coûte cher et prend du temps. La solution a été d'implémenter un système de cache SQLite. Avant chaque requête, l'app vérifie si la question a déjà été posée. Résultat : une IA instantanée et hors-ligne (pour les requêtes déjà effectuées).
2. **Formatage JSON strict :** Coder l'application pour que le LLM réponde *exclusivement* en JSON afin que le frontend puisse générer des composants natifs (`EventCard`) plutôt que d'afficher du simple texte brut.
3. **Architecture Relationnelle sur Mobile :** Remplacer le classique `AsyncStorage` par `expo-sqlite` pour gérer des contraintes de clés étrangères (CASCADE) et s'assurer que la suppression d'un événement par l'admin nettoie instantanément les profils de tous les étudiants.
4. **UI Design (Premium Feel) :** Abandonner les styles basiques pour intégrer des ombres douces, des rayons de courbure prononcés (`Radius.xl`), et des interactions natives fluides (`RefreshControl`, `ScrollView` dynamiques).

---

## 🙏 Remerciements

- Construit avec **Expo & React Native** pour une expérience fluide.
- Modèles d'IA fournis par **Meta (Llama 3)** et inférence ultra-rapide par **Groq**.
- Icônes élégantes par **Lucide Icons**.

---
**CampusEvents AI** — *La vie de campus, repensée par l'Intelligence Artificielle.* 🎓
