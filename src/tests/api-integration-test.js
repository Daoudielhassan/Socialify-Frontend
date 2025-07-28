// Test script pour vérifier l'intégration des API endpoints
// Ce fichier peut être utilisé pour tester manuellement les endpoints

// Test de l'authentification
export const testAuth = async () => {
  console.log('🧪 Test de l\'authentification...');
  
  try {
    // Test login
    const loginResponse = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('✅ Login successful:', data);
      return data.access_token;
    } else {
      console.log('❌ Login failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return null;
  }
};

// Test de récupération des messages
export const testMessages = async (token) => {
  console.log('🧪 Test de récupération des messages...');
  
  try {
    const response = await fetch('http://localhost:8000/messages', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Messages response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Messages retrieved:', data);
      return data;
    } else {
      console.log('❌ Messages fetch failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Messages error:', error);
    return null;
  }
};

// Test de synchronisation des messages
export const testMessageFetch = async (token) => {
  console.log('🧪 Test de synchronisation des messages...');
  
  try {
    const response = await fetch('http://localhost:8000/messages/fetch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'gmail'
      })
    });
    
    console.log('Message fetch response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Message fetch successful:', data);
      return data;
    } else {
      console.log('❌ Message fetch failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Message fetch error:', error);
    return null;
  }
};

// Test de prédiction IA
export const testPredict = async (token) => {
  console.log('🧪 Test de prédiction IA...');
  
  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: 'test@example.com',
        subject: 'Urgent: Meeting tomorrow',
        content: 'Hi, we need to meet tomorrow for the project discussion. This is very important.',
        source: 'gmail'
      })
    });
    
    console.log('Predict response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Prediction successful:', data);
      return data;
    } else {
      console.log('❌ Prediction failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Prediction error:', error);
    return null;
  }
};

// Test de feedback
export const testFeedback = async (token) => {
  console.log('🧪 Test de soumission de feedback...');
  
  try {
    const response = await fetch('http://localhost:8000/feedback', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message_id: 'test-message-123',
        corrected_priority: 'very_urgent',
        corrected_context: 'business'
      })
    });
    
    console.log('Feedback response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Feedback submitted successfully:', data);
      return data;
    } else {
      console.log('❌ Feedback submission failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Feedback error:', error);
    return null;
  }
};

// Test d'analytics
export const testAnalytics = async (token) => {
  console.log('🧪 Test de récupération des analytics...');
  
  try {
    const response = await fetch('http://localhost:8000/analytics?range=30d', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Analytics response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Analytics retrieved:', data);
      return data;
    } else {
      console.log('❌ Analytics fetch failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Analytics error:', error);
    return null;
  }
};

// Test complet de tous les endpoints
export const runAllTests = async () => {
  console.log('🚀 Démarrage des tests d\'intégration API...');
  
  // Test 1: Authentification
  const token = await testAuth();
  if (!token) {
    console.log('❌ Tests arrêtés - authentification échouée');
    return;
  }
  
  // Test 2: Messages
  await testMessages(token);
  
  // Test 3: Synchronisation des messages
  await testMessageFetch(token);
  
  // Test 4: Prédiction IA
  await testPredict(token);
  
  // Test 5: Feedback
  await testFeedback(token);
  
  // Test 6: Analytics
  await testAnalytics(token);
  
  console.log('🎉 Tests terminés !');
};

// Pour utiliser dans la console du navigateur:
// import { runAllTests } from './src/tests/api-integration-test.js';
// runAllTests();

export default {
  testAuth,
  testMessages,
  testMessageFetch,
  testPredict,
  testFeedback,
  testAnalytics,
  runAllTests
};
