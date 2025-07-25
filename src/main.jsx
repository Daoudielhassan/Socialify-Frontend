import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

// ✅ Corriger ici : Vite utilise import.meta.env pour accéder aux variables .env
const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

console.log("✅ Google Client ID utilisé :", clientId);



if (!clientId) {
  console.warn("⚠️ ATTENTION: Vous devez configurer un vrai Google Client ID dans le fichier .env");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
