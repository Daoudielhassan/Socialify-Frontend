import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './useAuth';

// Créer le contexte des données
const DataContext = createContext();

// Provider des données
export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [sentimentData, setSentimentData] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Charger toutes les données du dashboard
  const loadDashboardData = async () => {
    try {
      await Promise.all([
        loadMessages(),
        loadDashboardStats(),
        loadSentimentData()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  // Charger les données quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    } else {
      // Réinitialiser les données quand l'utilisateur se déconnecte
      setMessages([]);
      setDashboardStats(null);
      setSentimentData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Charger les messages
  const loadMessages = async (params = {}) => {
    try {
      setIsLoadingMessages(true);
      const data = await apiService.getMessages(params);
      setMessages(data.messages || data || []);
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      setMessages([]);
      throw error;
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Charger les statistiques du dashboard
  const loadDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await apiService.getDashboardStats();
      setDashboardStats(data);
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // Utiliser des données par défaut en cas d'erreur
      setDashboardStats({
        totalUnread: 1234,
        personal: 856,
        business: 378,
        social: 142,
        promotions: 68
      });
      throw error;
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Charger les données de sentiment
  const loadSentimentData = async (timeRange = '30d') => {
    try {
      const data = await apiService.getSentimentAnalysis(timeRange);
      setSentimentData(data.sentimentData || data || []);
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des données de sentiment:', error);
      // Utiliser des données par défaut
      setSentimentData([
        { name: 'Jan', positive: 4000, negative: 2400, neutral: 2400 },
        { name: 'Feb', positive: 3000, negative: 1398, neutral: 2210 },
        { name: 'Mar', positive: 2000, negative: 9800, neutral: 2290 },
        { name: 'Apr', positive: 2780, negative: 3908, neutral: 2000 },
        { name: 'May', positive: 1890, negative: 4800, neutral: 2181 },
        { name: 'Jun', positive: 2390, negative: 3800, neutral: 2500 }
      ]);
      throw error;
    }
  };

  // Déclencher la synchronisation des messages
  const syncMessages = async (source = 'gmail') => {
    try {
      setIsLoadingMessages(true);
      const response = await apiService.fetchMessages(source);
      
      // Recharger les messages après la synchronisation
      await loadMessages();
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Soumettre un feedback
  const submitFeedback = async (messageId, feedback) => {
    try {
      const response = await apiService.submitFeedback(messageId, feedback);
      
      // Optionnel: recharger les messages pour voir les changements
      // await loadMessages();
      
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
      throw error;
    }
  };

  // Rafraîchir toutes les données
  const refreshData = () => {
    return loadDashboardData();
  };

  // Valeurs du contexte
  const value = {
    // État
    messages,
    dashboardStats,
    sentimentData,
    isLoadingMessages,
    isLoadingStats,
    
    // Actions
    loadMessages,
    loadDashboardStats,
    loadSentimentData,
    syncMessages,
    submitFeedback,
    refreshData,
    loadDashboardData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
