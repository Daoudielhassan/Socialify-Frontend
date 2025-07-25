// utils/fetchWithAuth.js
import { getToken, logout } from './auth';

/**
 * Effectue une requête HTTP avec authentification JWT
 * @param {string} url - L'URL de la requête
 * @param {Object} options - Les options de la requête (méthode, headers, body, etc.)
 * @returns {Promise<Response>} La réponse de la requête
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  // Préparer les headers par défaut
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Ajouter le token d'authentification si disponible
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  // Fusionner les headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Si le token est expiré ou invalide (401), déconnecter l'utilisateur
    if (response.status === 401) {
      console.warn('Token expiré ou invalide, déconnexion automatique');
      logout();
      // Optionnel: rediriger vers la page de connexion
      window.location.reload();
    }
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la requête avec authentification:', error);
    throw error;
  }
};