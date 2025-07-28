import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoadingSkeleton from './components/UI/LoadingSkeleton';
import { performanceMonitor } from './utils/performance';

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Inbox = React.lazy(() => import('./pages/Inbox'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Settings = React.lazy(() => import('./pages/Settings'));
const MessageDetails = React.lazy(() => import('./pages/MessageDetails'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Dev tools (only in development)
const DevTools = React.lazy(() => 
  process.env.NODE_ENV === 'development' 
    ? import('./components/DevTools')
    : Promise.resolve({ default: React.memo(() => null) })
);

// Loading component
const LoadingSpinner = () => <LoadingSkeleton type="card" />;

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  // Performance monitoring in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log initial performance metrics after app loads
      const timer = setTimeout(() => {
        performanceMonitor.logPerformanceSummary();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const googleClientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Login />
                      </Suspense>
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Register />
                      </Suspense>
                    </PublicRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Dashboard />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inbox"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Inbox />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inbox/:id"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <MessageDetails />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Analytics />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Settings />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Dev tools in development only */}
              {process.env.NODE_ENV === 'development' && (
                <Suspense fallback={null}>
                  <DevTools />
                </Suspense>
              )}
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;