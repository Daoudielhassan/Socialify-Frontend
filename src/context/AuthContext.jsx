import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

// Créer le contexte d'authentification
const AuthContext = createContext();

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = sessionStorage.getItem('jwt_token');
    const userEmail = sessionStorage.getItem('user_email');
    const userName = sessionStorage.getItem('user_name');
    
    if (token && userEmail) {
      setUser({
        email: userEmail,
        name: userName,
        token: token
      });
      setIsAuthenticated(true);
      console.log('✅ Utilisateur authentifié trouvé:', userEmail);
    } else {
      console.log('❌ Aucun utilisateur authentifié');
    }
    
    setIsLoading(false);
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(email, password);
      
      if (response.access_token) {
        // Stocker les données d'authentification
        sessionStorage.setItem('jwt_token', response.access_token);
        sessionStorage.setItem('user_email', email);
        sessionStorage.setItem('user_name', response.user?.name || email);
        
        // Mettre à jour l'état
        setUser({
          email: email,
          name: response.user?.name || email,
          token: response.access_token
        });
        setIsAuthenticated(true);
        
        console.log('✅ Connexion réussie:', email);
        return { success: true };
      } else {
        throw new Error('Token d\'accès manquant');
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de connexion Google
  const googleLogin = async (credential) => {
    try {
      setIsLoading(true);
      const response = await apiService.googleAuth(credential);
      
      if (response.access_token) {
        // Décoder le token Google pour récupérer les infos utilisateur
        const { jwtDecode } = await import('jwt-decode');
        const decoded = jwtDecode(credential);
        
        // Stocker les données d'authentification
        sessionStorage.setItem('jwt_token', response.access_token);
        sessionStorage.setItem('user_email', decoded.email);
        sessionStorage.setItem('user_name', decoded.name || decoded.email);
        
        // Mettre à jour l'état
        setUser({
          email: decoded.email,
          name: decoded.name || decoded.email,
          token: response.access_token
        });
        setIsAuthenticated(true);
        
        console.log('✅ Connexion Google réussie:', decoded.email);
        return { success: true };
      } else {
        throw new Error('Token d\'accès manquant');
      }
    } catch (error) {
      console.error('❌ Erreur de connexion Google:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer l'état local
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      
      console.log('✅ Déconnexion effectuée');
    }
  };

  // Valeurs du contexte
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    googleLogin,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
