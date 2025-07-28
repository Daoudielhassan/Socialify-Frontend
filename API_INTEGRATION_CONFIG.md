# Socialify Frontend - API Integration Configuration

## Vue d'ensemble

Cette configuration intègre l'application frontend Socialify avec les endpoints backend spécifiés. L'application utilise React, TypeScript, et Tailwind CSS avec une architecture basée sur des contextes pour la gestion de l'état.

## Endpoints Intégrés

### 1. Authentification
- **POST /auth/login** - Connexion email/mot de passe
- **POST /auth/google** - Connexion Google OAuth

### 2. Messages
- **GET /messages** - Récupération de tous les messages utilisateur avec prédictions
- **POST /messages/fetch** - Déclenchement de la synchronisation Gmail/WhatsApp
- **POST /predict** - Envoi de message brut au moteur IA

### 3. Feedback
- **POST /feedback** - Soumission de corrections de priorité/contexte

### 4. Analytics
- **GET /analytics** - Récupération des données d'analyse agrégées

## Architecture

### Contextes React

#### AuthContext (`src/context/AuthContext.tsx`)
Gère l'authentification utilisateur avec:
- Login email/password via `/auth/login`
- Google OAuth via `/auth/google`
- Stockage des tokens JWT dans sessionStorage
- Gestion automatique de la déconnexion en cas d'erreur 401

#### DataContext (`src/context/DataContext.tsx`)
Gère les données applicatives:
- Messages avec prédictions IA
- Analytics et métriques
- Opérations CRUD sur les messages
- Soumission de feedback

### Service API (`src/services/api.js`)

Le service API centralise toutes les requêtes backend avec:
- Gestion automatique des headers d'authentification
- Gestion d'erreurs avec redirection automatique si token expiré
- Méthodes pour tous les endpoints requis

#### Méthodes principales:

```javascript
// Authentification
apiService.login(email, password)
apiService.googleAuth(credential)

// Messages
apiService.getMessages(params)
apiService.fetchMessages(source)
apiService.predictMessage(messageData)

// Feedback
apiService.submitFeedback(messageId, correctedPriority, correctedContext)

// Analytics
apiService.getAnalytics(timeRange)
```

## Configuration des variables d'environnement

Le fichier `.env` contient:
```
VITE_REACT_APP_GOOGLE_CLIENT_ID=326087496528-9r3vse6rfbvbhj7158hbcri46pcs7gl0.apps.googleusercontent.com
VITE_REACT_APP_API_URL=http://localhost:8000
```

## Pages mises à jour

### Dashboard (`src/pages/Dashboard.tsx`)
- Utilise `useData()` pour récupérer les statistiques en temps réel
- Affiche les métriques calculées depuis les vraies données
- Bouton de rafraîchissement pour déclencher la synchronisation
- Graphique des messages basé sur les données d'analytics

### Inbox (`src/pages/Inbox.tsx`)
- Affiche les messages récupérés via `GET /messages`
- Filtrage et recherche côté client
- Modal de feedback intégré pour les corrections
- Gestion des états de chargement

### Analytics (`src/pages/Analytics.tsx`)
- Visualisations basées sur `GET /analytics`
- Graphiques de distribution des contextes
- Tendances de feedback et précision du modèle
- Sélecteur de plage de dates

## Gestion d'état

### Messages
```typescript
interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  source: 'gmail' | 'whatsapp';
  priority: 'very_urgent' | 'important' | 'not_important';
  context: 'business' | 'personal';
  confidence: number;
  isRead: boolean;
  fullContent?: string;
}
```

### Analytics
```typescript
interface AnalyticsData {
  contextData: Array<{ name: string; value: number; color: string }>;
  priorityData: Array<{ name: string; very_urgent: number; important: number; not_important: number }>;
  feedbackData: Array<{ name: string; correct: number; incorrect: number }>;
  messageVolumeData: Array<{ name: string; messages: number }>;
  totalMessages: number;
  urgentMessages: number;
  accuracyRate: number;
}
```

## Flux de données

### 1. Authentification
1. Utilisateur se connecte via email/password ou Google OAuth
2. Backend retourne `access_token` et informations utilisateur
3. Token stocké dans `sessionStorage`
4. Redirection vers dashboard

### 2. Chargement des données
1. `DataContext` charge automatiquement les messages et analytics
2. Dashboard affiche les statistiques calculées
3. Inbox affiche la liste des messages
4. Analytics affiche les graphiques

### 3. Synchronisation des messages
1. Utilisateur clique sur "Refresh" ou "Fetch Messages"
2. Appel à `POST /messages/fetch` avec source (gmail/whatsapp)
3. Rechargement automatique des messages via `GET /messages`

### 4. Correction de prédictions
1. Utilisateur ouvre modal de feedback depuis un message
2. Sélection de la priorité/contexte corrects
3. Soumission via `POST /feedback`
4. Mise à jour locale des données

## Gestion d'erreurs

- **401 Unauthorized**: Déconnexion automatique et redirection vers login
- **Erreurs réseau**: Affichage de messages d'erreur utilisateur-friendly
- **Données manquantes**: Fallback vers données mock pour éviter les crashes

## Sécurité

- Tokens JWT stockés dans `sessionStorage` (plus sécurisé que `localStorage`)
- Nettoyage automatique des données d'authentification
- Validation des réponses API avant traitement
- Headers d'authentification automatiques

## Déploiement

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

## Dépendances clés

- **React 18** - Framework principal
- **TypeScript** - Typage statique
- **React Router DOM** - Routing
- **@react-oauth/google** - Google OAuth
- **Recharts** - Graphiques et visualisations
- **Headless UI** - Composants UI accessibles
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes

## Points d'attention

1. **Rate Limiting**: Implémenter une limitation côté client si nécessaire
2. **Cache**: Considérer l'ajout de cache pour les données d'analytics
3. **Offline**: Gestion des états hors ligne
4. **Pagination**: Ajouter la pagination pour les grandes listes de messages
5. **Websockets**: Pour les mises à jour en temps réel des nouveaux messages

## Tests

Pour tester l'intégration:
1. Démarrer le backend sur `http://localhost:8000`
2. Lancer le frontend avec `npm run dev`
3. Tester l'authentification
4. Vérifier la récupération des messages
5. Tester la soumission de feedback
6. Vérifier les analytics

## Support

En cas de problème:
1. Vérifier les logs de la console navigateur
2. Vérifier les logs du backend
3. Confirmer que tous les endpoints sont disponibles
4. Vérifier la configuration des variables d'environnement
