import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

// ✅ Corriger ici : Vite utilise import.meta.env pour accéder aux variables .env
const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

console.log("✅ Google Client ID utilisé :", clientId);
console.log("🚀 main.jsx - Démarrage de l'application");

if (!clientId) {
  console.warn("⚠️ ATTENTION: Vous devez configurer un vrai Google Client ID dans le fichier .env");
}

// Testons maintenant l'app principale avec gestion d'erreur
try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
  console.log("✅ App principale montée avec succès");
} catch (error) {
  console.error("❌ Erreur lors du montage de l'app principale:", error);
  // Fallback vers TestApp en cas d'erreur
}
