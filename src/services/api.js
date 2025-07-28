// API Service pour gérer toutes les requêtes vers le backend
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Méthode pour récupérer le token d'authentification
  getAuthToken() {
    return sessionStorage.getItem('jwt_token');
  }

  // Méthode pour créer les headers avec authentification
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Méthode générique pour faire des requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.requireAuth !== false),
        ...options.headers,
      },
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      // Vérifier si la réponse est OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${config.method || 'GET'} ${url}`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${config.method || 'GET'} ${url}`, error);
      
      // Si le token est expiré (401), on nettoie la session
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        this.clearAuthData();
        window.location.href = '/login';
      }
      
      throw error;
    }
  }

  // Méthodes HTTP
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Méthode pour nettoyer les données d'authentification
  clearAuthData() {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_name');
    localStorage.removeItem('user');
  }

  // === MÉTHODES D'AUTHENTIFICATION ===

  // Connexion par email/mot de passe
  async login(email, password) {
    return this.post('/auth/login', { email, password }, { requireAuth: false });
  }

  // Connexion Google OAuth
  async googleAuth(credential) {
    return this.post('/auth/google', { credential }, { requireAuth: false });
  }

  // Déconnexion
  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // === MÉTHODES POUR LES MESSAGES ===

  // Récupérer les messages de l'utilisateur
  async getMessages(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/messages?${queryParams}` : '/messages';
    return this.get(endpoint);
  }

  // Déclencher la synchronisation Gmail/WhatsApp
  async fetchMessages(source = 'gmail') {
    return this.post('/messages/fetch', { source });
  }

  // Soumettre une correction/feedback pour un message
  async submitFeedback(messageId, feedback) {
    return this.post('/feedback', { 
      message_id: messageId, 
      feedback 
    });
  }

  // === MÉTHODES SUPPLÉMENTAIRES ===

  // Récupérer les statistiques du dashboard
  async getDashboardStats() {
    return this.get('/dashboard/stats');
  }

  // Récupérer les données d'analyse de sentiment
  async getSentimentAnalysis(timeRange = '30d') {
    return this.get(`/analytics/sentiment?range=${timeRange}`);
  }

  // Récupérer les paramètres utilisateur
  async getUserSettings() {
    return this.get('/user/settings');
  }

  // Mettre à jour les paramètres utilisateur
  async updateUserSettings(settings) {
    return this.put('/user/settings', settings);
  }
}

// Exporter une instance unique du service
export const apiService = new ApiService();
export default apiService;
