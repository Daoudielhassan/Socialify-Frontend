import React from "react";
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
  Eye
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

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    dashboardStats, 
    sentimentData, 
    isLoadingStats, 
    syncMessages,
    refreshData 
  } = useData();

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
    try {
      await syncMessages('gmail');
      // Optionnel: afficher un message de succès
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      // Optionnel: afficher un message d'erreur
    }
  };

  const handleRefreshData = async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
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

//   const personalVsBusinessData = [
//     { name: 'Mon', personal: 80, business: 120 },
//     { name: 'Tue', personal: 90, business: 140 },
//     { name: 'Wed', personal: 100, business: 160 },
//     { name: 'Thu', personal: 85, business: 130 },
//     { name: 'Fri', personal: 110, business: 180 },
//     { name: 'Sat', personal: 60, business: 80 },
//     { name: 'Sun', personal: 50, business: 60 },
//   ];

  if (!user) {
    return null; // Ne pas afficher pendant la redirection
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              className="flex items-center px-4 py-2 space-x-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Send className="w-4 h-4" />
              <span>Sync Messages</span>
            </button>
            <button className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total Unread</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUnread}</div>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Personal</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.personal}</div>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8% from last month</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">Business</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.business}</div>
            <div className="flex items-center space-x-1 text-sm text-red-600">
              <TrendingUp className="w-4 h-4 rotate-180" />
              <span>-4% from last month</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-gray-600">Social</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.social}</div>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+18% from last month</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Facebook className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Promotions</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.promotions}</div>
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
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={2} />
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
            <div className="ml-2 font-semibold text-blue-600">Visily</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
