import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useData } from '../context';
import { 
  Search, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Mail,
  Phone,
  Send,
  Facebook,
  Archive,
  Reply,
  MoreHorizontal,
  ChevronDown,
  Download,
  Eye,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

function DashboardFixed() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    dashboardStats, 
    sentimentData, 
    isLoadingStats, 
    syncMessages,
    refreshData 
  } = useData();

  // États locaux pour les notifications
  const [issyncing, setSyncing] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const goToInbox = () => {
    navigate("/inbox");
  };

  const goToAnalytics = () => {
    navigate("/analytics");
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  const handleSyncMessages = async () => {
    setSyncing(true);
    try {
      await syncMessages('gmail');
      setNotification({ type: 'success', message: 'Messages synchronisés avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      setNotification({ type: 'error', message: 'Erreur lors de la synchronisation' });
    } finally {
      setSyncing(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRefreshData = async () => {
    try {
      await refreshData();
      setNotification({ type: 'success', message: 'Données actualisées !' });
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      setNotification({ type: 'error', message: 'Erreur lors du rafraîchissement' });
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const pieData = [
    { name: 'Positive', value: 400 },
    { name: 'Negative', value: 300 },
    { name: 'Neutral', value: 300 },
    { name: 'Mixed', value: 200 },
  ];

  // Utiliser les données du contexte ou des valeurs par défaut
  const stats = dashboardStats || {
    totalUnread: 1234,
    personal: 856,
    business: 378,
    social: 142,
    promotions: 68
  };

  const personalVsBusinessData = [
    { name: 'Mon', personal: 80, business: 120 },
    { name: 'Tue', personal: 90, business: 140 },
    { name: 'Wed', personal: 100, business: 160 },
    { name: 'Thu', personal: 85, business: 130 },
    { name: 'Fri', personal: 110, business: 180 },
    { name: 'Sat', personal: 60, business: 80 },
    { name: 'Sun', personal: 50, business: 60 },
  ];

  if (!user) {
    return null; // Ne pas afficher pendant la redirection
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">SocialifyIA</span>
            </div>
            <nav className="flex space-x-6">
              <button className="pb-2 font-medium text-gray-900 border-b-2 border-blue-600">Dashboard</button>
              <button onClick={goToInbox} className="text-gray-500 hover:text-gray-900">Inbox</button>
              <button onClick={goToAnalytics} className="text-gray-500 hover:text-gray-900">Analytics</button>
              <button onClick={goToSettings} className="text-gray-500 hover:text-gray-900">Settings</button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={handleSyncMessages}
              disabled={issyncing}
              className={`flex items-center px-4 py-2 space-x-2 text-white rounded-lg ${
                issyncing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {issyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{issyncing ? 'Syncing...' : 'Sync Messages'}</span>
            </button>
            <button 
              onClick={handleRefreshData}
              className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center px-4 py-2 space-x-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700">
              <Settings className="w-4 h-4" />
              <span>Customize AI</span>
            </button>
            <div className="text-sm text-gray-600">
              Connecté: {user?.name || user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Loading State */}
        {isLoadingStats && (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-lg text-gray-600">Chargement des données...</span>
            </div>
          </div>
        )}

        {!isLoadingStats && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
              <div className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Unread</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalUnread.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% from last month</span>
                </div>
              </div>

              <div className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Personal</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.personal.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8% from last month</span>
                </div>
              </div>

              <div className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Business</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.business.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-sm text-red-600">
                  <TrendingUp className="w-4 h-4 rotate-180" />
                  <span>-4% from last month</span>
                </div>
              </div>

              <div className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm text-gray-600">Social</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.social.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+18% from last month</span>
                </div>
              </div>

              <div className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Facebook className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Promotions</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.promotions.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+25% from last month</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
              {/* Sentiment Analysis Chart */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sentimentData || personalVsBusinessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="personal" stroke="#10B981" strokeWidth={2} name="Positive" />
                    <Line type="monotone" dataKey="business" stroke="#EF4444" strokeWidth={2} name="Negative" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Email Categories Pie Chart */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Email Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Business vs Personal Chart */}
            <div className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Personal vs Business Emails</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={personalVsBusinessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="personal" fill="#10B981" name="Personal" />
                  <Bar dataKey="business" fill="#3B82F6" name="Business" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="pt-8 mt-12 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">© 2025 SocialifyIA. All rights reserved.</div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <span className="text-sm text-gray-400">Made with</span>
            <div className="ml-2 font-semibold text-blue-600">❤️ by SocialifyIA Team</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default DashboardFixed;
