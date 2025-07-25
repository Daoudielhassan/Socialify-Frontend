// utils/auth.js

/**
 * Récupère le token JWT depuis sessionStorage
 * @returns {string|null} Le token JWT ou null s'il n'existe pas
 */
export const getToken = () => {
  try {
    return sessionStorage.getItem('jwt_token');
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

/**
 * Récupère l'email de l'utilisateur depuis sessionStorage
 * @returns {string|null} L'email de l'utilisateur ou null s'il n'existe pas
 */
export const getUserEmail = () => {
  try {
    return sessionStorage.getItem('user_email');
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'email:', error);
    return null;
  }
};

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean} True si l'utilisateur est connecté, false sinon
 */
export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && token !== '';
};

/**
 * Stocke le token JWT et l'email utilisateur
 * @param {string} token - Le token JWT
 * @param {string} email - L'email de l'utilisateur
 */
export const setAuthData = (token, email) => {
  try {
    sessionStorage.setItem('jwt_token', token);
    sessionStorage.setItem('user_email', email);
  } catch (error) {
    console.error('Erreur lors du stockage des données d\'authentification:', error);
  }
};

/**
 * Déconnecte l'utilisateur en supprimant ses données d'authentification
 */
export const logout = () => {
  try {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_email');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};