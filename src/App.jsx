import React, { useState, useEffect } from 'react';import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/AuthPage'; // Using the existing LoginGoogle component

function App() {
  const [user, setUser] = useState(null); // Start with null to show login first

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('user', username);

  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.clear();

    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch((error) => {
      console.error('Erreur lors de la déconnexion:', error);
    });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;