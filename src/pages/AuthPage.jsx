import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function AuthPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;


  const handleGoogleSuccess = (credentialResponse) => {
    setIsLoading(true);
    setError('');
    
    const idToken = credentialResponse.credential;
    const decoded = jwtDecode(idToken);
    console.log('✅ Google ID Token:', decoded);

    fetch(`${apiUrl}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: idToken }), // <-- key is 'credential'
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          sessionStorage.setItem('jwt_token', data.access_token);
          sessionStorage.setItem('user_email', decoded.email);
          sessionStorage.setItem('user_name', decoded.name || decoded.email);
          onLogin(decoded.email);
          navigate('/dashboard');
        } else {
          setError('Erreur de connexion: ' + (data.detail || 'Token invalide'));
        }
      })
      .catch(error => {
        console.error('❌ Erreur lors de la connexion Google:', error);
        setError('Erreur de connexion au serveur. Vérifiez que le backend est démarré.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };



  const handleGoogleError = () => {
    console.log('❌ Google Login Failed');
    setError('Échec de la connexion Google. Veuillez réessayer.');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        sessionStorage.setItem('jwt_token', data.access_token);
        sessionStorage.setItem('user_email', email);
        sessionStorage.setItem('user_name', name || email);
        onLogin(email);
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Erreur de connexion par email');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion par email:', error);
      setError('Erreur de connexion au serveur. Vérifiez que le backend est démarré.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      sessionStorage.setItem('jwt_token', data.access_token);
      sessionStorage.setItem('user_email', email);
      sessionStorage.setItem('user_name', name || email);
      onLogin(email);
      navigate('/dashboard');
    } else {
      setError(data.detail || 'Erreur lors de l’inscription');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l’inscription :', error);
    setError('Erreur de connexion au serveur.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Utilisez votre compte Google ou vos identifiants
          </p>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Connexion Google en premier (plus visible) */}
        <div className="flex justify-center">
          <div className="w-full">
            <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  useOneTap
  size="large"
  width="100%"
  shape="pill"
/>


          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">
              Ou connectez-vous avec votre email
            </span>
          </div>
        </div>

        {/* Formulaire de connexion par email */}
       <form className="mt-8 space-y-6" onSubmit={isRegisterMode ? handleRegister : handleEmailLogin}>
  {isRegisterMode && (
    <div>
      <label htmlFor="name" className="sr-only">Nom</label>
      <input
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        required
        disabled={isLoading}
        className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Nom complet"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  )}

  <div>
    <label htmlFor="email-address" className="sr-only">Adresse email</label>
    <input
      id="email-address"
      name="email"
      type="email"
      autoComplete="email"
      required
      disabled={isLoading}
      className={`appearance-none ${isRegisterMode ? '' : 'rounded-t-md'} relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
      placeholder="Adresse email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>

  <div>
    <label htmlFor="password" className="sr-only">Mot de passe</label>
    <input
      id="password"
      name="password"
      type="password"
      autoComplete="current-password"
      required
      disabled={isLoading}
      className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder="Mot de passe"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>

  <div>
    <button
      type="submit"
      disabled={isLoading}
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
    >
      {isLoading ? 'Chargement...' : isRegisterMode ? "S'inscrire" : 'Se connecter'}
    </button>
  </div>
</form>

<div className="text-sm text-center">
  {isRegisterMode ? (
    <>
      <span>Vous avez déjà un compte ? </span>
      <button type="button" onClick={() => setIsRegisterMode(false)} className="text-indigo-600 hover:text-indigo-800 font-medium">
        Se connecter
      </button>
    </>
  ) : (
    <>
      <span>Pas encore de compte ? </span>
      <button type="button" onClick={() => setIsRegisterMode(true)} className="text-indigo-600 hover:text-indigo-800 font-medium">
        S'inscrire
      </button>
    </>
  )}
</div>


        {/* Note pour le développement */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            💡 Pour le développement : La connexion par email nécessite l'implémentation côté backend
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

