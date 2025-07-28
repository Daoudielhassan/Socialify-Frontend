import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// @ts-ignore
import { apiService } from '../services/api';

interface User {
  email: string;
  name: string;
  token: string;
  id?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (credential: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
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
        name: userName || userEmail,
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
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
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
          token: response.access_token,
          id: response.user?.id,
          avatar: response.user?.avatar
        });
        setIsAuthenticated(true);
        
        console.log('✅ Connexion réussie:', email);
        return { success: true };
      } else {
        throw new Error('Token d\'accès manquant');
      }
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de connexion Google
  const googleLogin = async (credential: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.googleAuth(credential);
      
      if (response.access_token) {
        // Décoder le token Google pour récupérer les infos utilisateur
        const { jwtDecode } = await import('jwt-decode');
        const decoded: any = jwtDecode(credential);
        
        // Stocker les données d'authentification
        sessionStorage.setItem('jwt_token', response.access_token);
        sessionStorage.setItem('user_email', decoded.email || response.user?.email);
        sessionStorage.setItem('user_name', decoded.name || response.user?.name || decoded.email);
        
        // Mettre à jour l'état
        setUser({
          email: decoded.email || response.user?.email,
          name: decoded.name || response.user?.name || decoded.email,
          token: response.access_token,
          id: response.user?.id,
          avatar: response.user?.avatar
        });
        setIsAuthenticated(true);
        
        console.log('✅ Connexion Google réussie:', decoded.email);
        return { success: true };
      } else {
        throw new Error('Token d\'accès manquant');
      }
    } catch (error: any) {
      console.error('❌ Erreur de connexion Google:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.post('/auth/register', { 
        name, 
        email, 
        password 
      }, { requireAuth: false });
      
      if (response.access_token) {
        // Stocker les données d'authentification
        sessionStorage.setItem('jwt_token', response.access_token);
        sessionStorage.setItem('user_email', email);
        sessionStorage.setItem('user_name', name);
        
        // Mettre à jour l'état
        setUser({
          email: email,
          name: name,
          token: response.access_token,
          id: response.user?.id,
          avatar: response.user?.avatar
        });
        setIsAuthenticated(true);
        
        console.log('✅ Inscription réussie:', email);
        return { success: true };
      } else {
        throw new Error('Token d\'accès manquant');
      }
    } catch (error: any) {
      console.error('❌ Erreur d\'inscription:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async (): Promise<void> => {
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
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    googleLogin,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;